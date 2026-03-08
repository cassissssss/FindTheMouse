// aframe/catalog-spawner.js
AFRAME.registerComponent('catalog-spawner', {
    schema: {
        mode: { type: 'string', default: 'roundrobin' }, // 'random' | 'roundrobin'
        includeIds: { type: 'string', default: '' },
        container: { type: 'string', default: '#spawned-items' },
        handSelector: { type: 'string', default: '#hand-right' },
        spawnProxySelector: { type: 'string', default: '#spawn-proxy' },

        hideTargetSelector: { type: 'string', default: '#cardboard-stack' },

        busyTimeoutMs: { type: 'number', default: 900 },
        debug: { type: 'boolean', default: false }
    },

    init() {
        this._busy = false
        this._busyTimer = null

        this._queue = []
        this._cursor = 0

        this._onSpawned = this._onSpawned.bind(this)
        this._onBlocked = this._onBlocked.bind(this)
    },

    play() {
        const sceneEl = this.el.sceneEl
        sceneEl?.addEventListener('catalog:spawned', this._onSpawned)
        sceneEl?.addEventListener('catalog:blocked', this._onBlocked)

        this._buildQueue()
        this._applyVisibility()
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
            }, this.data.busyTimeoutMs)
        }
    },

    _getCatalogItem(id) {
        const all = window.APP_CATALOG || []
        return all.find((x) => x.id === id) || null
    },

    _parseIncludeIds() {
        const raw = (this.data.includeIds || '')
            .split(',')
            .map((s) => s.trim())
            .filter(Boolean)

        const seen = new Set()
        const unique = []
        for (const id of raw) {
            if (seen.has(id)) continue
            seen.add(id)
            unique.push(id)
        }

        return unique
    },

    _shuffle(arr) {
        for (let i = arr.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1))
                ;[arr[i], arr[j]] = [arr[j], arr[i]]
        }
        return arr
    },

    _buildQueue() {
        const ids = this._parseIncludeIds()
        const queue = []

        for (const id of ids) {
            const item = this._getCatalogItem(id)
            if (!item) continue

            const max = Number.isFinite(item.maxInstances) ? item.maxInstances : 1
            for (let k = 0; k < Math.max(0, max); k++) queue.push(id)
        }

        if (this.data.mode === 'random') this._shuffle(queue)

        this._queue = queue
        this._cursor = 0

        this._log('queue size:', this._queue.length, this._queue)
    },

    _isDone() {
        return this._cursor >= this._queue.length
    },

    _applyVisibility() {
        const sceneEl = this.el.sceneEl
        if (!sceneEl) return

        const target = sceneEl.querySelector(this.data.hideTargetSelector)
        if (!target) return

        if (this._isDone()) {
            target.setAttribute('visible', 'false')
            target.classList.remove('clickable')
        } else {
            target.setAttribute('visible', 'true')
            target.classList.add('clickable')
        }
    },

    _nextItemId() {
        if (this._isDone()) return null
        const id = this._queue[this._cursor]
        return id || null
    },

    _advance() {
        this._cursor++
        this._applyVisibility()
    },

    _onSpawned(evt) {
        this._log('spawned', evt?.detail)
        this._setBusy(false)

        // ✅ on avance seulement quand le spawn est confirmé
        this._advance()
    },

    _onBlocked(evt) {
        this._log('blocked', evt?.detail)
        this._setBusy(false)

        // ✅ si blocked (ex: collision / max / busy), on n’avance PAS
        this._applyVisibility()
    },

    spawnOne(detail = {}) {
        const sceneEl = this.el.sceneEl
        if (!sceneEl) return
        if (this._busy) {
            this._log('blocked: busy')
            return
        }

        // si itemId fourni -> spawn ciblé, sinon -> queue
        const itemId = (detail.itemId || '').trim() || this._nextItemId()

        if (!itemId) {
            this._log('done -> hide')
            this._applyVisibility()
            return
        }

        const proxy = sceneEl.querySelector(this.data.spawnProxySelector)
        const spawnComp = proxy?.components?.['spawn-from-catalog']
        if (!proxy || !spawnComp) return

        this._setBusy(true)

        proxy.setAttribute('spawn-from-catalog', {
            itemId,
            container: this.data.container,
            handSelector: detail.handSelector || this.data.handSelector
        })

        spawnComp._spawn?.()
    }
})