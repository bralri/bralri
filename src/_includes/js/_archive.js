import * as THREE from 'three';
import {GLTFLoader} from 'three/GLTFLoader.js';

const manager = new THREE.LoadingManager();
const loader = new GLTFLoader(manager);
const path = '/assets/models/vessels/archive/vessel-';
const createCaption = (id, author) => {
    let captionText = 
    `                                
        <span class="title">vessel-${id}</span><br>
        <i class="author">created by ${author}</i><br>
    ` 
    return captionText;
}

const database = {
    '1498': () => {
        const asset = loadModel(`${path}1498.glb`);
        asset.then((asset) => {
            asset.mesh.userData = {
                id: asset.mesh.id,
                caption: createCaption('1498', 'Bryan Ridpath')
            };
        });
        return asset;
    },
    '1654': () => {
        const asset = loadModel(`${path}1654.glb`);
        asset.then((asset) => {
            asset.mesh.userData = {
                id: asset.mesh.id,
                caption: createCaption('1498', 'Bryan Ridpath')
            };
        });
        return asset;
    },
    '2654': () => {
        const asset = loadModel(`${path}2654.glb`);
        asset.then((asset) => {
            asset.mesh.userData = {
                id: asset.mesh.id,
                caption: createCaption('2654', 'Bryan Ridpath')
            };
        });
        return asset;
    },
    '3154': () => {
        const asset = loadModel(`${path}3154.glb`);
        asset.then((asset) => {
            asset.mesh.userData = {
                id: asset.mesh.id,
                caption: createCaption('3154', 'Bryan Ridpath')
            };
        });
        return asset;
    },
    '10420': () => {
        const asset = loadModel(`${path}10420.glb`);
        asset.then((asset) => {
            asset.mesh.userData = {
                id: asset.mesh.id,
                caption: createCaption('10420', 'Bryan Ridpath')
            };
        });
        return asset;
    },
    '12354': () => {
        const asset = loadModel(`${path}12354.glb`);
        asset.then((asset) => {
            asset.mesh.userData = {
                id: asset.mesh.id,
                caption: createCaption('31548', 'Bryan Ridpath')
            };
        });
        return asset;
    },
    '31548': () => {
        const asset = loadModel(`${path}31548.glb`);
        asset.then((asset) => {
            asset.mesh.userData = {
                id: asset.mesh.id,
                caption: createCaption('31548', 'Bryan Ridpath')
            };
        });
        return asset;
    },
    '32062': () => {
        const asset = loadModel(`${path}32062.glb`);
        asset.then((asset) => {
            asset.mesh.userData = {
                id: asset.mesh.id,
                caption: createCaption('32062', 'Bryan Ridpath')
            };
        });
        return asset;
    },
    '35154': () => {
        const asset = loadModel(`${path}35154.glb`);
        asset.then((asset) => {
            asset.mesh.userData = {
                id: asset.mesh.id,
                caption: createCaption('35154', 'Bryan Ridpath')
            };
        });
        return asset;
    },
    '35416': () => {
        const asset = loadModel(`${path}35416.glb`);
        asset.then((asset) => {
            asset.mesh.userData = {
                id: asset.mesh.id,
                caption: createCaption('35416', 'Bryan Ridpath')
            };
        });
        return asset;
    },
    '35464': () => {
        const asset = loadModel(`${path}35464.glb`);
        asset.then((asset) => {
            asset.mesh.userData = {
                id: asset.mesh.id,
                caption: createCaption('35464', 'Bryan Ridpath')
            };
        });
        return asset;
    },
    '35932': () => {
        const asset = loadModel(`${path}35932.glb`);
        asset.then((asset) => {
            asset.mesh.userData = {
                id: asset.mesh.id,
                caption: createCaption('35932', 'Bryan Ridpath')
            };
        });
        return asset;
    },
    '36461': () => {
        const asset = loadModel(`${path}36461.glb`);
        asset.then((asset) => {
            asset.mesh.userData = {
                id: asset.mesh.id,
                caption: createCaption('36461', 'Bryan Ridpath')
            };
        });
        return asset;
    },
    '37841': () => {
        const asset = loadModel(`${path}37841.glb`);
        asset.then((asset) => {
            asset.mesh.userData = {
                id: asset.mesh.id,
                caption: createCaption('37841', 'Bryan Ridpath')
            };
        });
        return asset;
    },
    '46514': () => {
        const asset = loadModel(`${path}46514.glb`);
        asset.then((asset) => {
            asset.mesh.userData = {
                id: asset.mesh.id,
                caption: createCaption('46514', 'Bryan Ridpath')
            };
        });
        return asset;
    },
    '46516': () => {
        const asset = loadModel(`${path}46516.glb`);
        asset.then((asset) => {
            asset.mesh.userData = {
                id: asset.mesh.id,
                caption: createCaption('46516', 'Bryan Ridpath')
            };
        });
        return asset;
    },
    '58605': () => {
        const asset = loadModel(`${path}58605.glb`);
        asset.then((asset) => {
            asset.mesh.userData = {
                id: asset.mesh.id,
                caption: createCaption('58605', 'Bryan Ridpath')
            };
        });
        return asset;
    },
    '61585': () => {
        const asset = loadModel(`${path}61585.glb`);
        asset.then((asset) => {
            asset.mesh.userData = {
                id: asset.mesh.id,
                caption: createCaption('61585', 'Bryan Ridpath')
            };
        });
        return asset;
    },
    '64521': () => {
        const asset = loadModel(`${path}64521.glb`);
        asset.then((asset) => {
            asset.mesh.userData = {
                id: asset.mesh.id,
                caption: createCaption('64521', 'Bryan Ridpath')
            };
        });
        return asset;
    },
    '64651': () => {
        const asset = loadModel(`${path}64651.glb`);
        asset.then((asset) => {
            asset.mesh.userData = {
                id: asset.mesh.id,
                caption: createCaption('64651', 'Bryan Ridpath')
            };
        });
        return asset;
    },
    '65423': () => {
        const asset = loadModel(`${path}65423.glb`);
        asset.then((asset) => {
            asset.mesh.userData = {
                id: asset.mesh.id,
                caption: createCaption('65423', 'Bryan Ridpath')
            };
        });
        return asset;
    },
    '79469': () => {
        const asset = loadModel(`${path}79469.glb`);
        asset.then((asset) => {
            asset.mesh.userData = {
                id: asset.mesh.id,
                caption: createCaption('79469', 'Bryan Ridpath')
            };
        });
        return asset;
    },
    '79841': () => {
        const asset = loadModel(`${path}79841.glb`);
        asset.then((asset) => {
            asset.mesh.userData = {
                id: asset.mesh.id,
                caption: createCaption('79841', 'Bryan Ridpath')
            };
        });
        return asset;
    },
    '94136': () => {
        const asset = loadModel(`${path}94136.glb`);
        asset.then((asset) => {
            asset.mesh.userData = {
                id: asset.mesh.id,
                caption: createCaption('94136', 'Bryan Ridpath')
            };
        });
        return asset;
    },
    '98765': () => {
        const asset = loadModel(`${path}98765.glb`);
        asset.then((asset) => {
            asset.mesh.userData = {
                id: asset.mesh.id,
                caption: createCaption('98765', 'Bryan Ridpath')
            };
        });
        return asset;
    },
    '98851': () => {
        const asset = loadModel(`${path}98851.glb`);
        asset.then((asset) => {
            asset.mesh.userData = {
                id: asset.mesh.id,
                caption: createCaption('98851', 'Bryan Ridpath')
            };
        });
        return asset;
    },
}

const loadModel = (src) => {
    return new Promise((resolve, reject) => {
        loader.load(src, (glb) => {
            const mesh = glb.scene;
            
            resolve({
                mesh
            });
        }, undefined, reject)
    });
}

export const archive = [
    {
        id: '1498'
    },
    {
        id: '1654'
    },
    {
        id: '2654'
    },
    {
        id: '3154'
    },
    {
        id: '10420'
    },
    {
        id: '12354'
    },
    // {
    //     id: '31548'
    // },
    {
        id: '32062'
    },
    {
        id: '35154'
    },
    {
        id: '35416'
    },
    {
        id: '35464'
    },
    {
        id: '35932'
    },
    {
        id: '36461'
    },
    {
        id: '37841'
    },
    {
        id: '46514'
    },
    {
        id: '46516'
    },
    {
        id: '58605'
    },
    {
        id: '61585'
    },
    {
        id: '64521'
    },
    {
        id: '64651'
    },
    {
        id: '65423'
    },
    {
        id: '79469'
    },
    {
        id: '79841'
    },
    {
        id: '94136'
    },
    {
        id: '98765'
    },
    {
        id: '98851'
    },
]

export const createAssetInstance = async (id) => {
    if (id in database) {
        const asset = await database[id]();
        return asset;
    } else {
        console.log(`Asset ${id} does not exist`);
        return undefined;
    }
}