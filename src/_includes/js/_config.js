import * as THREE from 'three';
import {GLTFLoader} from 'three/GLTFLoader.js';

const manager = new THREE.LoadingManager();
const loader = new GLTFLoader(manager);

const fetchAsset = (id) => {
    const asset = loadModel(`/assets/models/vessels/${id}.glb`);
    return asset;
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

export const createAssetInstance = async (id) => {
    try {
        const asset = await fetchAsset(id);
        return asset;
    } catch (error) {
        console.log(`Asset ${id}.glb does not exist`, error);
        return undefined;
    }
}