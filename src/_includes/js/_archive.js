import * as THREE from 'three';
import {GLTFLoader} from 'three/GLTFLoader.js';

const manager = new THREE.LoadingManager();
const loader = new GLTFLoader(manager);
const createCaption = (title, author) => {
    let captionText = 
    `                                
        <span class="title">${title}</span><br>
        <i class="author">created by ${author}</i><br>
    ` 
    return captionText;
}

const fetchModels = async () => {
    try {
        const response = await fetch('/.netlify/functions/fetchSubmissions');
        const data = await response.json();
        const files = data.files;

        files.forEach((item) => {
            const asset = loadModel(item.publicUrl);
            asset.then((asset) => {
                asset.mesh.userData = {
                    id: asset.mesh.id,
                    caption: createCaption(item.name, 'Bryan Ridpath')
                };
            });
            return asset;
        });
    } catch (error) {
        console.error('Error fetching file URLs:', error);
    }
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

export const createAssetInstance = async () => {
    if (id in database) {
        const asset = await fetchModels();
        return asset;
    } else {
        console.log(`Asset does not exist`);
        return undefined;
    }
}