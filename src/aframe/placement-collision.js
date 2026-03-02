AFRAME.registerComponent('placement-collision', {
    schema: {
        collidableSelector: { type: 'string', default: '[physx-grabbable]' },
        wallSelector: { type: 'string', default: '.room-collider' },
        padding: { type: 'number', default: 0.01 }
    },

    init() {
        this._tmpSelf = new THREE.Box3()
        this._tmpOther = new THREE.Box3()
    },

    _inflate(box) {
        const p = this.data.padding
        box.min.x -= p; box.min.y -= p; box.min.z -= p
        box.max.x += p; box.max.y += p; box.max.z += p
    },

    _getMeshesFromSelector(selector) {
        const sceneEl = this.el.sceneEl
        if (!sceneEl) return []
        const els = Array.from(sceneEl.querySelectorAll(selector))
        const meshes = []
        for (const e of els) {
            e.object3D.traverse((o) => { if (o.isMesh) meshes.push(o) })
        }
        return meshes
    },

    collidesWithWalls() {
        this.el.object3D.updateMatrixWorld(true)
        this._tmpSelf.setFromObject(this.el.object3D)
        this._inflate(this._tmpSelf)

        const wallMeshes = this._getMeshesFromSelector(this.data.wallSelector)
        for (const w of wallMeshes) {
            this._tmpOther.setFromObject(w)
            if (this._tmpSelf.intersectsBox(this._tmpOther)) return true
        }
        return false
    },

    collidesWithOtherObjects() {
        this.el.object3D.updateMatrixWorld(true)
        this._tmpSelf.setFromObject(this.el.object3D)
        this._inflate(this._tmpSelf)

        const sceneEl = this.el.sceneEl
        if (!sceneEl) return false

        const others = Array.from(sceneEl.querySelectorAll(this.data.collidableSelector))
        for (const otherEl of others) {
            if (!otherEl || otherEl === this.el) continue
            otherEl.object3D.updateMatrixWorld(true)
            this._tmpOther.setFromObject(otherEl.object3D)
            if (this._tmpSelf.intersectsBox(this._tmpOther)) return true
        }
        return false
    },

    isValid() {
        if (this.collidesWithWalls()) return false
        if (this.collidesWithOtherObjects()) return false
        return true
    }
})