AFRAME.registerComponent('physx-grabbable', {
    schema: {
        yMode: { type: 'string', default: 'free' }, // 'free', 'lock', 'range'
        minY: { type: 'number', default: NaN },
        maxY: { type: 'number', default: NaN },
        floorOffsetY: { type: 'number', default: 0 }
    }
})