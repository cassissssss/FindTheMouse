// aframe/catalog-spawner.js
AFRAME.registerComponent('catalog-spawner', {
    schema: {
        mode: { type: 'string', default: 'roundrobin' }, // 'random' | 'roundrobin'
        includeIds: { type: 'string', default: '' },
        container: { type: 'string', default: '#spawned-items' },
        handSelector: { type: 'string', default: '#hand-right' },
        spawnProxySelector: { type: 'string', default: '#spawn-proxy' },

        hideTargetSelector: { type: 'string', default: '#cardboard-stack' },
        hideOnEmpty: { type: 'boolean', default: true },

        // ✅ sécurité anti “busy bloqué”
        busyTimeoutMs: { type: 'number', default: 900 },

        // ✅ logs optionnels
        debug: { type: 'boolean', default: false }
    },

    init() {
        this._idx = 0
        this._busy = false
        this._busyTimer = null

        this._onSpawned = this._onSpawned.bind(this)
        this._onBlocked = this._onBlocked.bind(this)
    },

    play() {
        const sceneEl = this.el.sceneEl
        sceneEl?.addEventListener('catalog:spawned', this._onSpawned)
        sceneEl?.addEventListener('catalog:blocked', this._onBlocked)
        this._updateEmptyState()
    },

    pause() {
        const sceneEl = this.el.sceneEl
        sceneEl?.removeEventListener('catalog:spawned', this._onSpawned)
        sceneEl?.removeEventListener('catalog:blocked', this._onBlocked)
        this._clearBusyTimer()
    },

    _log(...args) {
        if (!this.data.debug) return
        // eslint-disable-next-line no-console
        console.log('[catalog-spawner]', ...args)
    },

    _clearBusyTimer() {
        if (!this._busyTimer) return
        clearTimeout(this._busyTimer)
        this._busyTimer = null
    },

    _setBusy(value) {
        this._busy = value
        this._clearBusyTimer()

        if (value) {
            this._busyTimer = setTimeout(() => {
                this._log('busy timeout -> unlock')
                this._busy = false
                this._busyTimer = null
                this._updateEmptyState()
            }, this.data.busyTimeoutMs)
        }
    },

    _onSpawned(evt) {
        this._log('spawned', evt?.detail)
        this._setBusy(false)
        this._updateEmptyState()
    },

    _onBlocked(evt) {
        this._log('blocked', evt?.detail)
        this._setBusy(false)
        this._updateEmptyState()
    },

    _getCatalog() {
        const all = window.APP_CATALOG || []

        const ids = (this.data.includeIds || '')
            .split(',')
            .map((s) => s.trim())
            .filter(Boolean)

        if (!ids.length) return all

        const set = new Set(ids)
        return all.filter((i) => set.has(i.id))
    },

    _getContainerEl(sceneEl) {
        return sceneEl.querySelector(this.data.container) || sceneEl
    },

    _countPlaced(containerEl, itemId) {
        const safe = window.CSS && CSS.escape ? CSS.escape(itemId) : itemId.replace(/"/g, '\\"')
        return containerEl.querySelectorAll(`[data-item-id="${safe}"]`).length
    },

    _remainingFor(item, containerEl) {
        const max = Number.isFinite(item.maxInstances) ? item.maxInstances : 1
        const placed = this._countPlaced(containerEl, item.id)
        return Math.max(0, max - placed)
    },

    _getAvailableItems(sceneEl) {
        const containerEl = this._getContainerEl(sceneEl)
        const list = this._getCatalog()
        return list.filter((item) => this._remainingFor(item, containerEl) > 0)
    },

    _pickItemId(sceneEl) {
        const available = this._getAvailableItems(sceneEl)
        if (!available.length) return null

        if (this.data.mode === 'random') {
            const r = Math.floor(Math.random() * available.length)
            return available[r].id
        }

        // ✅ roundrobin stable même si certains items sont full
        this._idx = this._idx % available.length
        const id = available[this._idx].id
        this._idx = (this._idx + 1) % available.length
        return id
    },

    _updateEmptyState() {
        if (!this.data.hideOnEmpty) return
        const sceneEl = this.el.sceneEl
        if (!sceneEl) return

        const available = this._getAvailableItems(sceneEl)
        const hideTarget = sceneEl.querySelector(this.data.hideTargetSelector)
        if (!hideTarget) return

        if (available.length === 0) {
            hideTarget.setAttribute('visible', 'false')
            hideTarget.classList.remove('clickable')
        } else {
            hideTarget.setAttribute('visible', 'true')
            hideTarget.classList.add('clickable')
        }
    },

    spawnOne(detail = {}) {
        const sceneEl = this.el.sceneEl
        if (!sceneEl) return
        if (this._busy) {
            this._log('blocked: busy')
            return
        }

        const itemId = detail.itemId || this._pickItemId(sceneEl)
        if (!itemId) {
            this._log('no item available -> hide maybe')
            this._setBusy(false)
            this._updateEmptyState()
            return
        }

        const proxy = sceneEl.querySelector(this.data.spawnProxySelector)
        const spawnComp = proxy?.components?.['spawn-from-catalog']

        if (!proxy || !spawnComp) {
            this._log('missing spawn-proxy or component spawn-from-catalog')
            this._setBusy(false)
            return
        }

        // ✅ lock avec timeout sécurité
        this._setBusy(true)

        proxy.setAttribute('spawn-from-catalog', {
            itemId,
            container: this.data.container,
            handSelector: detail.handSelector || this.data.handSelector
        })

        // spawn
        spawnComp._spawn?.()
    }
})