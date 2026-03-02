AFRAME.registerComponent('move-sfx', {
    schema: {
        src: { type: 'string', default: '#creak-sfx' },

        // seuils (mètres / seconde)
        minSpeed: { type: 'number', default: 0.08 },   // commence le son si vitesse > minSpeed
        stopSpeed: { type: 'number', default: 0.03 },  // stop si vitesse < stopSpeed

        // fréquence de check
        intervalMs: { type: 'number', default: 60 },

        // audio
        volume: { type: 'number', default: 0.6 },
        positional: { type: 'boolean', default: true },
        refDistance: { type: 'number', default: 1.2 },
        rolloffFactor: { type: 'number', default: 1.1 },

        // option : uniquement quand l'objet est "tenu"
        onlyWhileHeld: { type: 'boolean', default: true }
    },

    init() {
        this._prev = new THREE.Vector3()
        this._curr = new THREE.Vector3()

        this._lastT = 0
        this._playing = false
        this._held = false

        // sound node
        this._soundEl = null

        this._onGrabStart = this._onGrabStart.bind(this)
        this._onGrabEnd = this._onGrabEnd.bind(this)
    },

    play() {
        // état "held" (on écoute tes events de grab)
        this.el.addEventListener('grab-start', this._onGrabStart)
        this.el.addEventListener('grab-end', this._onGrabEnd)

        // init pos
        this.el.object3D.getWorldPosition(this._prev)

        // crée un a-sound enfant (si absent)
        this._ensureSound()
    },

    pause() {
        this.el.removeEventListener('grab-start', this._onGrabStart)
        this.el.removeEventListener('grab-end', this._onGrabEnd)
        this._stop()
    },

    _onGrabStart() {
        this._held = true
    },

    _onGrabEnd() {
        this._held = false
        this._stop()
    },

    _ensureSound() {
        // si déjà présent, on le réutilise
        const existing = this.el.querySelector('a-sound[data-move-sfx="1"]')
        if (existing) {
            this._soundEl = existing
            return
        }

        const s = document.createElement('a-sound')
        s.setAttribute('data-move-sfx', '1')
        s.setAttribute('src', this.data.src)
        s.setAttribute('autoplay', 'false')
        s.setAttribute('loop', 'true') // ✅ loop pendant mouvement
        s.setAttribute('volume', String(this.data.volume))
        s.setAttribute('positional', this.data.positional ? 'true' : 'false')
        s.setAttribute('refDistance', String(this.data.refDistance))
        s.setAttribute('rolloffFactor', String(this.data.rolloffFactor))

        this.el.appendChild(s)
        this._soundEl = s
    },

    _play() {
        const soundComp = this._soundEl?.components?.sound
        if (!soundComp) return
        if (this._playing) return
        this._playing = true
        soundComp.playSound()
    },

    _stop() {
        const soundComp = this._soundEl?.components?.sound
        if (!soundComp) return
        if (!this._playing) return
        this._playing = false
        soundComp.stopSound()
    },

    tick(time) {
        if (time - this._lastT < this.data.intervalMs) return
        this._lastT = time

        if (this.data.onlyWhileHeld && !this._held) {
            this._stop()
            return
        }

        this.el.object3D.getWorldPosition(this._curr)

        const dt = Math.max(this.data.intervalMs / 1000, 0.016)
        const dist = this._curr.distanceTo(this._prev)
        const speed = dist / dt

        // hysteresis (minSpeed pour start, stopSpeed pour stop)
        if (!this._playing && speed >= this.data.minSpeed) {
            this._play()
        } else if (this._playing && speed <= this.data.stopSpeed) {
            this._stop()
        }

        this._prev.copy(this._curr)
    }
})