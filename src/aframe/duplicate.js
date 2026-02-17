AFRAME.registerComponent('duplicate', {
  schema: {
    width: { type: 'number', default: 1 },
    depth: { type: 'number', default: 1 },
    gap: { type: 'number', default: 0.1 },
    rows: { type: 'number', default: 1 },
    cols: { type: 'number', default: 1 },
    center: { type: 'boolean', default: true }

  },

  init: function () {
    const target = this.el;
    const basePos = target.getAttribute('position');
    const stepX = this.data.width + this.data.gap;
    const stepZ = this.data.depth + this.data.gap;

    const totalWidth = this.data.rows * stepX;
    const totalDepth = this.data.cols * stepZ;

    const startX = this.data.center ? basePos.x - totalWidth / 2 + this.data.width / 2 : basePos.x;
    const startZ = this.data.center ? basePos.z + totalDepth / 2 - this.data.depth / 2 : basePos.z;

    this.clones = [];

    for (let i = 0; i < this.data.rows; i++) {
      for (let j = 0; j < this.data.cols; j++) {
        if (i === 0 && j === 0) {
          target.setAttribute('position', {
            x: startX,
            y: basePos.y,
            z: startZ
          });
          continue;
        }
        const clone = target.cloneNode(true);
        clone.removeAttribute('duplicate');
        clone.setAttribute('position', {
          x: startX + i * stepX,
          y: basePos.y,
          z: startZ - j * stepZ
        });
        target.parentNode.appendChild(clone);
        this.clones.push(clone);
      }
    }
  },


  remove: function () {
    if (!this.clones) return;
    this.clones.forEach((clone) => clone.parentNode && clone.parentNode.removeChild(clone));
    this.clones = null;
  },

});