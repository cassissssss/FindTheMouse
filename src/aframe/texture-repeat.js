AFRAME.registerComponent('texture-repeat', {
    schema: {
        repeatX: { type: 'number', default: 50 },
        repeatY: { type: 'number', default: 50 }
    },

    init() {
        const applyRepeat = () => {
            const mesh = this.el.getObject3D('mesh')
            if (!mesh) return

            mesh.traverse((node) => {
                if (!node.isMesh) return
                const mat = node.material
                if (!mat) return

                const setRepeat = (map) => {
                    if (!map) return
                    map.wrapS = THREE.RepeatWrapping
                    map.wrapT = THREE.RepeatWrapping
                    map.repeat.set(this.data.repeatX, this.data.repeatY)
                    map.needsUpdate = true
                }

                setRepeat(mat.map)
                setRepeat(mat.normalMap)
                setRepeat(mat.roughnessMap)
            })
        }

        this.el.addEventListener('object3dset', applyRepeat)
        applyRepeat()
    }
})
