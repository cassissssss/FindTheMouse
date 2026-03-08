// utils/catalog.js
export const catalog = [
    {
        id: 'desk',
        label: 'Bureau',
        assetId: '#desk-asset',
        maxInstances: 1,
        default: { scale: '0.75 0.75 0.75', yMode: 'lock', moveSfx: true },
        physx: { body: 'type: dynamic; mass: 3', shape: 'type: box' }
    },
    {
        id: 'couch',
        label: 'Canapé',
        assetId: '#couch-asset',
        maxInstances: 1,
        default: { scale: '0.75 0.75 0.75', yMode: 'lock', moveSfx: true },
        physx: { body: 'type: dynamic; mass: 5', shape: 'type: box' }
    },
    {
        id: 'tv-table',
        label: 'Table de télévision',
        assetId: '#tv-table-asset',
        maxInstances: 1,
        default: { scale: '0.75 0.75 0.75', yMode: 'lock', moveSfx: true },
        physx: { body: 'type: dynamic; mass: 4', shape: 'type: box' }
    },
    {
        id: 'chair',
        label: 'Chaise',
        assetId: '#chair-asset',
        maxInstances: 1,
        default: { scale: '0.75 0.75 0.75', yMode: 'lock', moveSfx: true },
        physx: { body: 'type: dynamic; mass: 2', shape: 'type: box' }
    },
    {
        id: 'little-table',
        label: 'Petite table',
        assetId: '#little-table-asset',
        maxInstances: 1,
        default: { scale: '0.75 0.75 0.75', yMode: 'lock', moveSfx: true },
        physx: { body: 'type: dynamic; mass: 2', shape: 'type: box' }
    },
    {
        id: 'speaker',
        label: 'Speaker',
        assetId: '#speaker1-asset',
        maxInstances: 2,
        default: { scale: '0.75 0.75 0.75', yMode: 'lock', moveSfx: true },
        physx: { body: 'type: dynamic; mass: 1', shape: 'type: box' }
    },
    {
        id: 'plant',
        label: 'Plante',
        assetId: '#plant-asset',
        maxInstances: 1,
        default: { scale: '0.75 0.75 0.75', yMode: 'lock', moveSfx: true },
        physx: { body: 'type: dynamic; mass: 1', shape: 'type: box' }
    },

    {
        id: 'pc',
        label: 'PC',
        assetId: '#pc-asset',
        maxInstances: 1,
        default: { scale: '0.75 0.75 0.75', yMode: 'free', moveSfx: false },
        physx: { body: 'type: dynamic; mass: 1', shape: 'type: box' }
    },
    {
        id: 'keyboard',
        label: 'Clavier',
        assetId: '#keyboard-asset',
        maxInstances: 1,
        default: { scale: '0.75 0.75 0.75', yMode: 'free', moveSfx: false },
        physx: { body: 'type: dynamic; mass: 0.5', shape: 'type: box' }
    },
    {
        id: 'mouse',
        label: 'Souris',
        assetId: '#mouse-asset',
        maxInstances: 1,
        default: { scale: '0.75 0.75 0.75', yMode: 'free', moveSfx: false },
        physx: { body: 'type: dynamic; mass: 0.3', shape: 'type: box' }
    },

    {
        id: 'lamp',
        label: 'Lampe',
        assetId: '#lamp-asset',
        maxInstances: 1,
        default: { scale: '0.75 0.75 0.75', yMode: 'free', moveSfx: false },
        physx: { body: 'type: dynamic; mass: 1', shape: 'type: box' }
    },


    {
        id: 'little-plant',
        label: 'Petite plante',
        assetId: '#little-plant-asset',
        maxInstances: 1,
        default: { scale: '0.75 0.75 0.75', yMode: 'free', moveSfx: false },
        physx: { body: 'type: dynamic; mass: 0.8', shape: 'type: box' }
    },

    {
        id: 'book2',
        label: 'Livre',
        assetId: '#book2-asset',
        maxInstances: 1,
        default: { scale: '0.75 0.75 0.75', yMode: 'free', moveSfx: false },
        physx: { body: 'type: dynamic; mass: 0.4', shape: 'type: box' }
    },
    {
        id: 'books1',
        label: 'Livres (pile)',
        assetId: '#books1-asset',
        maxInstances: 1,
        default: { scale: '0.75 0.75 0.75', yMode: 'free', moveSfx: false },
        physx: { body: 'type: dynamic; mass: 0.8', shape: 'type: box' }
    },
    {
        id: 'books2',
        label: 'Livres (pile 2)',
        assetId: '#books2-asset',
        maxInstances: 1,
        default: { scale: '0.75 0.75 0.75', yMode: 'free', moveSfx: false },
        physx: { body: 'type: dynamic; mass: 0.8', shape: 'type: box' }
    },

    {
        id: 'cup',
        label: 'Tasse',
        assetId: '#cup-asset',
        maxInstances: 1,
        default: { scale: '0.75 0.75 0.75', yMode: 'free', moveSfx: false },
        physx: { body: 'type: dynamic; mass: 0.25', shape: 'type: box' }
    },
    {
        id: 'cup2',
        label: 'Tasse (2)',
        assetId: '#cup2-asset',
        maxInstances: 1,
        default: { scale: '0.75 0.75 0.75', yMode: 'free', moveSfx: false },
        physx: { body: 'type: dynamic; mass: 0.25', shape: 'type: box' }
    },
    {
        id: 'candle',
        label: 'Bougie',
        assetId: '#candle-asset',
        maxInstances: 1,
        default: { scale: '0.75 0.75 0.75', yMode: 'free', moveSfx: false },
        physx: { body: 'type: dynamic; mass: 0.2', shape: 'type: box' }
    },
    {
        id: 'kobo',
        label: 'Kobo',
        assetId: '#kobo-asset',
        maxInstances: 1,
        default: { scale: '0.75 0.75 0.75', yMode: 'free', moveSfx: false },
        physx: { body: 'type: dynamic; mass: 0.3', shape: 'type: box' }
    },

    {
        id: 'painting',
        label: 'Tableau',
        assetId: '#painting-asset',
        maxInstances: 1,
        default: { scale: '0.75 0.75 0.75', yMode: 'free', moveSfx: false },
        physx: { body: 'type: dynamic; mass: 0.6', shape: 'type: box' }
    },
    {
        id: 'photo',
        label: 'Photo',
        assetId: '#photo-asset',
        maxInstances: 1,
        default: { scale: '0.75 0.75 0.75', yMode: 'free', moveSfx: false },
        physx: { body: 'type: dynamic; mass: 0.3', shape: 'type: box' }
    },

    {
        id: 'vinyle',
        label: 'Vinyle',
        assetId: '#vinyle-asset',
        maxInstances: 1,
        default: { scale: '0.75 0.75 0.75', yMode: 'free', moveSfx: false },
        physx: { body: 'type: dynamic; mass: 0.3', shape: 'type: box' }
    },
    {
        id: 'discs',
        label: 'Disques',
        assetId: '#discs-asset',
        maxInstances: 1,
        default: { scale: '0.75 0.75 0.75', yMode: 'free', moveSfx: false },
        physx: { body: 'type: dynamic; mass: 0.6', shape: 'type: box' }
    },

    {
        id: 'plank1',
        label: 'Planche 1',
        assetId: '#plank1-asset',
        maxInstances: 1,
        default: { scale: '0.75 0.75 0.75', yMode: 'free', moveSfx: true },
        physx: { body: 'type: dynamic; mass: 1.5', shape: 'type: box' }
    },
    {
        id: 'plank2',
        label: 'Planche 2',
        assetId: '#plank2-asset',
        maxInstances: 1,
        default: { scale: '0.75 0.75 0.75', yMode: 'free', moveSfx: true },
        physx: { body: 'type: dynamic; mass: 1.5', shape: 'type: box' }
    }
]

window.APP_CATALOG = catalog