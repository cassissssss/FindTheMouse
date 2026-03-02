AFRAME.registerComponent('laser-click', {
    schema: {
        clickableSelector: { type: 'string', default: '.clickable' }
    },

    init() {
        this._onTriggerDown = this._onTriggerDown.bind(this)
        this._onGripDown = this._onGripDown.bind(this)
    },

    play() {
        this.el.addEventListener('triggerdown', this._onTriggerDown)
        this.el.addEventListener('gripdown', this._onGripDown)
    },

    pause() {
        this.el.removeEventListener('triggerdown', this._onTriggerDown)
        this.el.removeEventListener('gripdown', this._onGripDown)
    },

    _firstClickableIntersection() {
        const rc = this.el.components.raycaster
        if (!rc) return null

        const hits = rc.intersections || []
        if (!hits.length) return null

        for (const hit of hits) {
            let obj = hit.object
            while (obj && !obj.el) obj = obj.parent

            let target = obj?.el || null
            if (!target) continue

            // remonte au parent clickable si on touche un mesh enfant
            while (target && target !== this.el.sceneEl && !target.matches(this.data.clickableSelector)) {
                target = target.parentEl
            }

            if (!target || !target.matches(this.data.clickableSelector)) continue
            return target
        }

        return null
    },

    _emitClick(target) {
        // déclenche exactement ce que tes components écoutent déjà ("click")
        target.emit('click', { controller: this.el }, true)
    },

    _onTriggerDown() {
        const target = this._firstClickableIntersection()
        if (!target) return
        this._emitClick(target)
    },

    _onGripDown() {
        const target = this._firstClickableIntersection()
        if (!target) return
        this._emitClick(target)
    }
})