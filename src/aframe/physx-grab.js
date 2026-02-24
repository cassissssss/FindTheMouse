/*
From https://github.com/c-frame/physx

MIT License

Copyright (c) 2020 Zach Capalbo
Copyright (c) 2022 Lee Stemkoski
Copyright (c) 2022 Diarmid Mackenzie

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
*/
/**
 * Grab component.
 *
 * Based on an original component by Don McCurdy in aframe-physics-system
 *
 * 2026 Nicolas Chabloz: Test if the entity has a physx-grabbable attribute before grabbing it.
 *
 * Copyright (c) 2016 Don McCurdy
 */

AFRAME.registerComponent('physx-grab', {
  init: function () {
    // Non-clashing state name
    this.GRABBED_STATE = 'grabbed-dynamic';

    this.grabbing = false;
    this.hitEl = /** @type {AFRAME.Element|null} */ (null);
    this.currentHoveredEl = null;
    this.joint = null;

    // Bind event handlers
    this.onHit = this.onHit.bind(this);
    this.onContactEnd = this.onContactEnd.bind(this);
    this.onGripOpen = this.onGripOpen.bind(this);
    this.onGripClose = this.onGripClose.bind(this);
  },

  play: function () {
    const el = this.el;
    el.addEventListener('contactbegin', this.onHit);
    el.addEventListener('contactend', this.onContactEnd);

    el.addEventListener('gripdown', this.onGripClose);
    el.addEventListener('gripup', this.onGripOpen);

    el.addEventListener('trackpaddown', this.onGripClose);
    el.addEventListener('trackpadup', this.onGripOpen);

    el.addEventListener('triggerdown', this.onGripClose);
    el.addEventListener('triggerup', this.onGripOpen);
  },

  pause: function () {
    const el = this.el;
    el.removeEventListener('contactbegin', this.onHit);
    el.removeEventListener('contactend', this.onContactEnd);

    el.removeEventListener('gripdown', this.onGripClose);
    el.removeEventListener('gripup', this.onGripOpen);

    el.removeEventListener('trackpaddown', this.onGripClose);
    el.removeEventListener('trackpadup', this.onGripOpen);

    el.removeEventListener('triggerdown', this.onGripClose);
    el.removeEventListener('triggerup', this.onGripOpen);
  },

  onGripClose: function () {
    this.grabbing = true;
  },

  onGripOpen: function () {
    const hitEl = this.hitEl;
    this.grabbing = false;

    if (!hitEl) return;

    hitEl.removeState(this.GRABBED_STATE);

    // Remove outline-bloom when releasing
    if (this.currentHoveredEl && this.currentHoveredEl.is('hovered')) {
      this.currentHoveredEl.removeState('hovered');
      const outlineBloom = this.el.sceneEl?.components?.['outline-bloom'];
      if (outlineBloom) outlineBloom.removeObject(this.currentHoveredEl);
    }

    this.hitEl = null;
    this.currentHoveredEl = null;

    this.removeJoint();
  },

  onContactEnd: function (evt) {
    const hitEl = evt.detail?.otherComponent?.el;
    if (!hitEl || !hitEl.is('hovered')) return;

    hitEl.removeState('hovered');
    const outlineBloom = this.el.sceneEl?.components?.['outline-bloom'];
    if (outlineBloom) outlineBloom.removeObject(hitEl);

    if (this.currentHoveredEl === hitEl) this.currentHoveredEl = null;
  },

  onHit: function (evt) {
    const hitEl = evt.detail?.otherComponent?.el;
    if (!hitEl) return;

    if (!hitEl.hasAttribute('physx-grabbable')) return;

    const body = hitEl.components?.['physx-body'];
    if (body?.data?.type === 'static') return;

    // Hover outline
    if (!hitEl.is('hovered')) {
      hitEl.addState('hovered');
      const outlineBloom = this.el.sceneEl?.components?.['outline-bloom'];
      if (outlineBloom) outlineBloom.addObject(hitEl);
      this.currentHoveredEl = hitEl;
    }

    // Must be grabbing + not already grabbing something
    if (hitEl.is(this.GRABBED_STATE) || !this.grabbing || this.hitEl) return;

    hitEl.addState(this.GRABBED_STATE);
    this.hitEl = hitEl;

    // IMPORTANT: joint target is the element that has physx-grab (this.el)
    this.addJoint(hitEl, this.el);
  },

  addJoint: function (el, target) {
    this.removeJoint();

    if (!target?.id) return;

    this.joint = document.createElement('a-entity');
    this.joint.setAttribute('physx-joint', `type: Fixed; target: #${target.id}`);
    el.appendChild(this.joint);
  },

  removeJoint: function () {
    if (!this.joint) return;
    if (this.joint.parentElement) this.joint.parentElement.removeChild(this.joint);
    this.joint = null;
  }
});