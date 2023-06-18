import * as THREE from 'three';
import {GLTFLoader} from 'three/GLTFLoader.js';

const manager = new THREE.LoadingManager();
const loader = new GLTFLoader(manager);

const loadModels = (name, author, date, url) => {
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
                    <i class="author">by: ${author}</i><br>
                    <i class="author">created: ${date}</i><br>
                ` 
            }; // figure out a way to include the date day it way made
            resolve({
                mesh
            });
        }, undefined, reject)
    });
}

export const createAssetInstance = async (name, author, date, url) => {
    try {
        const asset = await loadModels(name, author, date, url);
        return asset;
    } catch (error) {
        console.log(`Asset does not exist`, error);
        return undefined;
    }
}