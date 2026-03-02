AFRAME.registerComponent('spawn-box', {
    schema: {
        spawner: { type: 'string', default: '#catalog-spawner' },
        itemId: { type: 'string', default: '' },

        // ✅ son
        soundSelector: { type: 'string', default: 'a-sound' },

        // ✅ anti double click
        cooldownMs: { type: 'number', default: 450 }
    },

    init() {
        this._locked = false
        this._onClick = this._onClick.bind(this)
    },

    play() {
        this.el.addEventListener('click', this._onClick)
    },

    pause() {
        this.el.removeEventListener('click', this._onClick)
    },

    _resolveHandSelectorFromEvent(evt) {
        const sceneEl = this.el.sceneEl
        if (!sceneEl) return '#hand-right'

        const candidates = [
            evt?.detail?.cursorEl,
            evt?.detail?.raycasterEl,
            evt?.detail?.intersection?.el
        ].filter(Boolean)

        for (const c of candidates) {
            if (c.id === 'hand-left' || c.id === 'hand-right') return `#${c.id}`

            let p = c
            while (p && p !== sceneEl && p.id !== 'hand-left' && p.id !== 'hand-right') {
                p = p.parentEl
            }
            if (p?.id === 'hand-left' || p?.id === 'hand-right') return `#${p.id}`
        }

        return '#hand-right'
    },

    _playSound() {
        const soundEl = this.el.querySelector(this.data.soundSelector)
        const soundComp = soundEl?.components?.sound
        if (!soundComp) return
        soundComp.stopSound()
        soundComp.playSound()
    },

    _onClick(evt) {
        // ✅ évite double déclenchement
        if (this._locked) return
        this._locked = true
        setTimeout(() => (this._locked = false), this.data.cooldownMs)

        // ✅ joue le son (sans stopper la propagation)
        this._playSound()

        const sceneEl = this.el.sceneEl
        if (!sceneEl) return

        const spawnerEl = sceneEl.querySelector(this.data.spawner)
        const spawner = spawnerEl?.components?.['catalog-spawner']
        if (!spawner) return

        spawner.spawnOne({
            itemId: this.data.itemId || '',
            handSelector: this._resolveHandSelectorFromEvent(evt)
        })
    }
})