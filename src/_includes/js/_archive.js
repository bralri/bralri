import * as THREE from 'three';
import {GLTFLoader} from 'three/GLTFLoader.js';

const manager = new THREE.LoadingManager();
const loader = new GLTFLoader(manager);

const loadModels = (name, url) => {
    return new Promise((resolve, reject) => {
        loader.load(
            
            url, 
            
            (glb) => {
            const mesh = glb.scene;
            mesh.userData = {
                id: mesh.id,
                caption:     
                `                                
                    <span class="title">${name}</span><br>
                    <i class="author">created by Bryan Ridpath</i><br>
                ` 
            };
            resolve({
                mesh
            });
        }, undefined, reject)
    });
}

export const createAssetInstance = async (name, url) => {
    try {
        const asset = await loadModels(name, url);
        return asset;
    } catch (error) {
        console.log(`Asset does not exist`, error);
        return undefined;
    }
}