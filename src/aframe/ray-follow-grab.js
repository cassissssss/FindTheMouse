AFRAME.registerComponent('ray-follow-grab', {
    schema: {
        grabbableSelector: { type: 'string', default: '[physx-grabbable]' },
        maxDistance: { type: 'number', default: 4 },
        useHitDistance: { type: 'boolean', default: true },
        holdDistance: { type: 'number', default: 0.7 },

        rotateWithThumbstick: { type: 'boolean', default: true },
        rotationSpeed: { type: 'number', default: 200 },

        wallSelector: { type: 'string', default: '.room-collider' },
        wallPadding: { type: 'number', default: 0.01 } // petite marge
    },

    init() {
        this.isHolding = false
        this.heldEl = null
        this.holdDistance = this.data.holdDistance

        this._origin = new THREE.Vector3()
        this._dir = new THREE.Vector3()
        this._pos = new THREE.Vector3()

        this._grabOffsetWorld = new THREE.Vector3()

        // Y constraints
        this._yMode = 'free'
        this._minY = null
        this._maxY = null
        this._baseY = null
        this._pivotToBottom = 0
        this._bottomClearance = 0

        // rotation relative
        this._startGrabQuat = new THREE.Quaternion()
        this._yawDeltaRad = 0
        this._yawQuat = new THREE.Quaternion()

        this._tmpBox = new THREE.Box3()
        this._tmpWallBox = new THREE.Box3()
        this._tmpVec = new THREE.Vector3()
        this._lastValidWorldPos = new THREE.Vector3()
        this._hasLastValid = false

        // binds
        this._onDown = this._onDown.bind(this)
        this._onUp = this._onUp.bind(this)
        this._onThumbstickMoved = this._onThumbstickMoved.bind(this)
    },

    play() {
        this.el.addEventListener('triggerdown', this._onDown)
        this.el.addEventListener('triggerup', this._onUp)
        this.el.addEventListener('gripdown', this._onDown)
        this.el.addEventListener('gripup', this._onUp)
        this.el.addEventListener('thumbstickmoved', this._onThumbstickMoved)
    },

    pause() {
        this.el.removeEventListener('triggerdown', this._onDown)
        this.el.removeEventListener('triggerup', this._onUp)
        this.el.removeEventListener('gripdown', this._onDown)
        this.el.removeEventListener('gripup', this._onUp)
        this.el.removeEventListener('thumbstickmoved', this._onThumbstickMoved)
    },

    _onThumbstickMoved(evt) {
        if (!this.isHolding) return

        const x = evt.detail?.x ?? 0
        const y = evt.detail?.y ?? 0

        this.holdDistance = THREE.MathUtils.clamp(
            this.holdDistance - y * 0.02,
            0.15,
            this.data.maxDistance
        )

        if (this.data.rotateWithThumbstick) {
            this._yawDeltaRad += THREE.MathUtils.degToRad(x * this.data.rotationSpeed * 0.01)
        }
    },

    _getHit() {
        const rc = this.el.components.raycaster
        if (!rc) return null

        const hits = rc.intersections || []
        if (!hits.length) return null

        const hit = hits[0]
        let target = hit.object?.el || null
        if (!target) return null

        while (target && target !== this.el.sceneEl && !target.matches(this.data.grabbableSelector)) {
            target = target.parentEl
        }
        if (!target || !target.matches(this.data.grabbableSelector)) return null

        return {
            target,
            distance: typeof hit.distance === 'number' ? hit.distance : null,
            point: hit.point ? hit.point.clone() : null
        }
    },

    _readYConstraints(el) {
        const cfg = el.getAttribute('physx-grabbable') || {}

        this._yMode = cfg.yMode || 'free'
        this._minY = Number.isFinite(cfg.minY) ? cfg.minY : null
        this._maxY = Number.isFinite(cfg.maxY) ? cfg.maxY : null

        const objWorldPos = new THREE.Vector3()
        el.object3D.getWorldPosition(objWorldPos)
        this._baseY = objWorldPos.y
    },

    _resetYConstraints() {
        this._yMode = 'free'
        this._minY = null
        this._maxY = null
        this._baseY = null
        this._pivotToBottom = 0
        this._bottomClearance = 0
    },

    _collectFloorMeshes() {
        const sceneEl = this.el.sceneEl
        if (!sceneEl) return []
        const floorEls = Array.from(sceneEl.querySelectorAll('.floor'))
        const floorMeshes = []
        for (const fe of floorEls) {
            fe.object3D.traverse((obj) => { if (obj.isMesh) floorMeshes.push(obj) })
        }
        return floorMeshes
    },

    _getFloorHitWorldPointFromWorldPos(worldPos) {
        const start = worldPos.clone()
        start.y += 2

        const raycaster = new THREE.Raycaster(start, new THREE.Vector3(0, -1, 0), 0, 10)
        const floorMeshes = this._collectFloorMeshes()
        if (!floorMeshes.length) return null

        const hits = raycaster.intersectObjects(floorMeshes, true)
        if (!hits.length) return null

        return hits[0].point.clone()
    },

    _applyYConstraints(worldPos) {
        if (this._yMode === 'lock') {
            const hitPointWorld = this._getFloorHitWorldPointFromWorldPos(worldPos)
            if (hitPointWorld) {
                const desiredBottomY = hitPointWorld.y + this._bottomClearance
                worldPos.y = desiredBottomY + this._pivotToBottom
            } else if (this._baseY !== null) {
                worldPos.y = this._baseY
            }
            return
        }

        if (this._yMode === 'range') {
            if (this._minY !== null) worldPos.y = Math.max(worldPos.y, this._minY)
            if (this._maxY !== null) worldPos.y = Math.min(worldPos.y, this._maxY)
        }
    },

    _getWallMeshes() {
        const sceneEl = this.el.sceneEl
        if (!sceneEl) return []
        const els = Array.from(sceneEl.querySelectorAll(this.data.wallSelector))
        const meshes = []
        for (const e of els) {
            e.object3D.traverse((obj) => { if (obj.isMesh) meshes.push(obj) })
        }
        return meshes
    },

    _wouldCollideWithWalls(el) {
        // AABB de l'objet (world)
        el.object3D.updateMatrixWorld(true)
        this._tmpBox.setFromObject(el.object3D)

        // padding (un tout petit “air gap”)
        this._tmpBox.min.x -= this.data.wallPadding
        this._tmpBox.min.y -= this.data.wallPadding
        this._tmpBox.min.z -= this.data.wallPadding
        this._tmpBox.max.x += this.data.wallPadding
        this._tmpBox.max.y += this.data.wallPadding
        this._tmpBox.max.z += this.data.wallPadding

        const walls = this._getWallMeshes()
        for (const w of walls) {
            this._tmpWallBox.setFromObject(w)
            if (this._tmpBox.intersectsBox(this._tmpWallBox)) return true
        }
        return false
    },

    _onDown() {
        if (this.isHolding) return

        const hit = this._getHit()
        if (!hit) return

        this.heldEl = hit.target
        this.isHolding = true

        this._readYConstraints(this.heldEl)

        this._yawDeltaRad = 0
        this.heldEl.object3D.getWorldQuaternion(this._startGrabQuat)

        if (this.data.useHitDistance && hit.distance !== null) {
            this.holdDistance = Math.min(hit.distance, this.data.maxDistance)
        } else {
            this.holdDistance = this.data.holdDistance
        }

        const objWorldPos = new THREE.Vector3()
        this.heldEl.object3D.getWorldPosition(objWorldPos)

        if (hit.point) this._grabOffsetWorld.copy(objWorldPos).sub(hit.point)
        else this._grabOffsetWorld.set(0, 0, 0)

        if (this._yMode === 'lock') {
            const cfg = this.heldEl.getAttribute('physx-grabbable') || {}
            const floorOffsetY = Number.isFinite(cfg.floorOffsetY) ? cfg.floorOffsetY : 0

            this.heldEl.object3D.updateMatrixWorld(true)
            const box = new THREE.Box3().setFromObject(this.heldEl.object3D)
            const bottomY = box.min.y
            const pivotY = objWorldPos.y

            this._pivotToBottom = pivotY - bottomY
            this._bottomClearance = floorOffsetY
        }

        this._lastValidWorldPos.copy(objWorldPos)
        this._hasLastValid = true
    },

    _onUp() {
        if (!this.isHolding || !this.heldEl) return

        // (ton snap floor si lock, tu peux le garder ici si tu veux)
        // mais avec la contrainte Y lock, c’est déjà propre.

        this._grabOffsetWorld.set(0, 0, 0)
        this._yawDeltaRad = 0

        this.isHolding = false
        this.heldEl = null
        this._resetYConstraints()
        this._hasLastValid = false
    },

    tick() {
        if (!this.isHolding || !this.heldEl) return

        const rc = this.el.components.raycaster
        const ray = rc?.raycaster?.ray
        if (!ray) return

        this._origin.copy(ray.origin)
        this._dir.copy(ray.direction).normalize()

        // candidate world position
        this._pos.copy(this._origin).add(this._dir.multiplyScalar(this.holdDistance))
        this._pos.add(this._grabOffsetWorld)

        this._applyYConstraints(this._pos)

        // appliquer candidate
        const parentObj = this.heldEl.object3D.parent
        if (!parentObj) return
        parentObj.updateMatrixWorld(true)

        const localPos = parentObj.worldToLocal(this._pos.clone())
        this.heldEl.object3D.position.copy(localPos)

        if (this.data.rotateWithThumbstick) {
            this._yawQuat.setFromAxisAngle(new THREE.Vector3(0, 1, 0), this._yawDeltaRad)
            this.heldEl.object3D.quaternion.copy(this._startGrabQuat).multiply(this._yawQuat)
        }

        this.heldEl.object3D.updateMatrixWorld(true)

        if (this._wouldCollideWithWalls(this.heldEl)) {
            if (this._hasLastValid) {
                const revertLocal = parentObj.worldToLocal(this._lastValidWorldPos.clone())
                this.heldEl.object3D.position.copy(revertLocal)
                this.heldEl.object3D.updateMatrixWorld(true)
            }
            return
        }

        this.heldEl.object3D.getWorldPosition(this._lastValidWorldPos)
        this._hasLastValid = true
    }
})