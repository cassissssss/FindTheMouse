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

    /*  gltf: {}
    
        this.clone0 = this.el.cloneNode();
        this.clone0.removeAttribute('duplicate');
        this.parent = document.createElement('a-entity');
        const box3d = new THREE.Box3.setFromObject(this.el.object3D);
        const size = new THREE.Vector3();
        box3d.getSize(size);
        this.width = size.x;
        this.depth = size.z;
        this.createDuplicates();
      },
      
      createDuplicates: function () {
        const clone = this.clone0.cloneNode();
        clone.object3D.position.set(this.width, 0, this.depth);
        if (this.data.gltf) clone.setAttribute('gltf-model', this.data.gltf);
        this.parent.appendChild(clone);
        this.el.appendChild(this.parent);

      }
    
     */
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

  update: function () {
  },

  remove: function () {
    if (!this.clones) return;
    this.clones.forEach((clone) => clone.parentNode && clone.parentNode.removeChild(clone));
    this.clones = null;
  },

});