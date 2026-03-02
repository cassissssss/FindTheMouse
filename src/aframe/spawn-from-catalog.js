// aframe/spawn-from-catalog.js
AFRAME.registerComponent('spawn-from-catalog', {
    schema: {
        itemId: { type: 'string', default: '' },
        container: { type: 'string', default: '#spawned-items' },

        handSelector: { type: 'string', default: '#hand-right' },

        spawnHeight: { type: 'number', default: 0.05 },

        boundsSelector: { type: 'string', default: '#nav-mesh' },
        boundsPadding: { type: 'number', default: 0.6 },

        // si tu veux éviter “collé à toi” => mets false
        autoGrab: { type: 'boolean', default: true },
        grabDistance: { type: 'number', default: 1.0 },

        placementCollisionAttr: {
            type: 'string',
            default:
                'collidableSelector: [physx-grabbable]; wallSelector: .room-collider; padding: 0.01'
        }
    },

    init() {
        this._spawnLocalPos = new THREE.Vector3()

        this._tmpQuat = new THREE.Quaternion()
        this._tmpEuler = new THREE.Euler(0, 0, 0, 'YXZ')

        this._spawning = false

        this._boundsBox = new THREE.Box3()
        this._boundsCenter = new THREE.Vector3()
        this._boundsValid = false
    },

    _emitBlocked(sceneEl, reason, extra = {}) {
        sceneEl.emit('catalog:blocked', { reason, ...extra }, false)
    },

    _getCatalogItem(id) {
        const catalog = window.APP_CATALOG || []
        return catalog.find((x) => x.id === id) || null
    },

    _getContainer(sceneEl) {
        return sceneEl.querySelector(this.data.container) || sceneEl
    },

    _countExisting(containerEl, itemId) {
        const safe = window.CSS && CSS.escape ? CSS.escape(itemId) : itemId.replace(/"/g, '\\"')
        return containerEl.querySelectorAll(`[data-item-id="${safe}"]`).length
    },

    _collectFloorMeshes(sceneEl) {
        const floorMeshes = []
        sceneEl.querySelectorAll('.floor').forEach((el) => {
            el.object3D.traverse((o) => {
                if (o.isMesh) floorMeshes.push(o)
            })
        })
        return floorMeshes
    },

    _getFloorYAt(sceneEl, worldPos) {
        const floorMeshes = this._collectFloorMeshes(sceneEl)
        if (!floorMeshes.length) return worldPos.y

        const start = worldPos.clone()
        start.y += 2

        const rc = new THREE.Raycaster(start, new THREE.Vector3(0, -1, 0), 0, 10)
        const hits = rc.intersectObjects(floorMeshes, true)
        if (!hits.length) return worldPos.y
        return hits[0].point.y
    },

    _computeFlatYawRotation(sceneEl) {
        const head = sceneEl.querySelector('#head')
        if (!head) return '0 0 0'
        head.object3D.getWorldQuaternion(this._tmpQuat)
        this._tmpEuler.setFromQuaternion(this._tmpQuat, 'YXZ')
        const ry = THREE.MathUtils.radToDeg(this._tmpEuler.y)
        return `0 ${ry} 0`
    },

    _ensureBounds(sceneEl) {
        const boundsEl = sceneEl.querySelector(this.data.boundsSelector)
        const boundsObj = boundsEl?.object3D
        if (!boundsObj) {
            this._boundsValid = false
            return false
        }

        boundsObj.updateMatrixWorld(true)
        this._boundsBox.setFromObject(boundsObj)
        this._boundsBox.getCenter(this._boundsCenter)

        this._boundsValid = isFinite(this._boundsBox.min.x) && isFinite(this._boundsBox.max.x)
        return this._boundsValid
    },

    _clampToBoundsXZ(worldPos) {
        const pad = this.data.boundsPadding
        worldPos.x = THREE.MathUtils.clamp(
            worldPos.x,
            this._boundsBox.min.x + pad,
            this._boundsBox.max.x - pad
        )
        worldPos.z = THREE.MathUtils.clamp(
            worldPos.z,
            this._boundsBox.min.z + pad,
            this._boundsBox.max.z - pad
        )
        return worldPos
    },

    _getSpawnWorldPos(sceneEl) {
        if (!this._boundsValid) this._ensureBounds(sceneEl)
        if (!this._boundsValid) return null

        const worldPos = this._boundsCenter.clone()
        const floorY = this._getFloorYAt(sceneEl, worldPos)
        worldPos.y = floorY + this.data.spawnHeight
        this._clampToBoundsXZ(worldPos)

        return worldPos
    },

    _spawn() {
        const sceneEl = this.el.sceneEl
        if (!sceneEl) return

        if (this._spawning) {
            this._emitBlocked(sceneEl, 'busy')
            return
        }

        const itemId = (this.data.itemId || '').trim()
        if (!itemId) {
            this._emitBlocked(sceneEl, 'missing-itemId')
            return
        }

        const item = this._getCatalogItem(itemId)
        if (!item) {
            this._emitBlocked(sceneEl, 'unknown-item', { itemId })
            return
        }

        const containerEl = this._getContainer(sceneEl)

        const max = Number.isFinite(item.maxInstances) ? item.maxInstances : 1
        const already = this._countExisting(containerEl, item.id)
        if (already >= max) {
            this._emitBlocked(sceneEl, 'max-instances', { itemId: item.id, max })
            return
        }

        const spawnWorldPos = this._getSpawnWorldPos(sceneEl)
        if (!spawnWorldPos) {
            this._emitBlocked(sceneEl, 'missing-bounds', { selector: this.data.boundsSelector })
            return
        }

        this._spawning = true

        containerEl.object3D.updateMatrixWorld(true)
        this._spawnLocalPos.copy(spawnWorldPos)
        containerEl.object3D.worldToLocal(this._spawnLocalPos)

        const entity = document.createElement('a-entity')
        entity.classList.add('clickable')
        entity.setAttribute('data-item-id', item.id)

        entity.setAttribute(
            'position',
            `${this._spawnLocalPos.x} ${this._spawnLocalPos.y} ${this._spawnLocalPos.z}`
        )
        entity.setAttribute('rotation', this._computeFlatYawRotation(sceneEl))
        entity.setAttribute('scale', item.default?.scale ?? '1 1 1')

        // ✅ IMPORTANT : gltf-model SUR LE MÊME EL que le grab
        entity.setAttribute('gltf-model', item.assetId)

        // grab target
        const yMode = item.default?.yMode ?? 'free'
        entity.setAttribute('physx-grabbable', `yMode: ${yMode}; floorOffsetY: 0.02`)

        // physx direct (pas de reset après)
        entity.setAttribute('physx-body', item.physx?.body ?? 'type: dynamic; mass: 1')
        entity.setAttribute('physx-shape', item.physx?.shape ?? 'type: box')

        if (this.data.placementCollisionAttr) {
            entity.setAttribute('placement-collision', this.data.placementCollisionAttr)
        }

        if (item.default?.moveSfx) {
            entity.setAttribute(
                'move-sfx',
                'src: #creak-sfx; volume: 0.55; minSpeed: 0.08; stopSpeed: 0.03; onlyWhileHeld: true;'
            )
        }

        entity.setAttribute('shadow', 'cast: true; receive: true')

        containerEl.appendChild(entity)

        const handEl = sceneEl.querySelector(this.data.handSelector)

        const finalize = () => {
            if (this.data.autoGrab && handEl) {
                handEl.emit('grab:force', { target: entity, distance: this.data.grabDistance }, false)
            }
            sceneEl.emit('catalog:spawned', { itemId: item.id }, false)
            this._spawning = false
        }

        // attend que le modèle existe (raycast + bbox + physx init)
        entity.addEventListener('model-loaded', () => {
            requestAnimationFrame(() => requestAnimationFrame(finalize))
        }, { once: true })

        // fallback
        setTimeout(() => {
            if (!this._spawning) return
            finalize()
        }, 2000)
    }
})