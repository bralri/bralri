import * as THREE from 'three';
import {GLTFLoader} from 'three/GLTFLoader.js';

const manager = new THREE.LoadingManager();
const loader = new GLTFLoader(manager);

const loadModels = (name, createdBy, date, url) => {

    const _name = name.split('.');

    // if (createdBy === 'undefined') {
    //     console.log('CreatedBy: ', createdBy);
    //     createdBy = 'Anonymous';
    //     console.log('CreatedBy: ', createdBy);
    // } else if (createdBy === 'null') {
    //     console.log('CreatedBy: ', createdBy);
    //     createdBy = 'Anonymous';
    //     console.log('CreatedBy: ', createdBy);
    // } else if (createdBy === 'Optional') {
    //     console.log('CreatedBy: ', createdBy);
    //     createdBy = 'Anonymous';
    //     console.log('CreatedBy: ', createdBy);
    // } else if (createdBy === '') {
    //     console.log('CreatedBy: ', createdBy);
    //     createdBy = 'Anonymous';
    //     console.log('CreatedBy: ', createdBy);
    // }

    if (createdBy === 'undefined' || createdBy === 'null' || createdBy === 'Optional' || createdBy === '') {
        console.log('CreatedBy: ', createdBy);
        createdBy = 'Anonymous';
        console.log('CreatedBy: ', createdBy);
    }
    

    return new Promise((resolve, reject) => {
        loader.load(

            url, 
            
            (glb) => {
            const mesh = glb.scene;
            mesh.userData = {
                id: mesh.id,
                caption:     
                `                                
                    <span class="title">${_name[0]}</span><br>
                    <i class="author">by: ${createdBy}</i><br>
                    <i class="author">created: ${date}</i><br>
                ` 
            };
            resolve({
                mesh
            });
        }, undefined, reject)
    });
}

export const createAssetInstance = async (name, createdBy, date, url) => {
    try {
        const asset = await loadModels(name, createdBy, date, url);
        return asset;
    } catch (error) {
        console.log(`Asset does not exist`, error);
        return undefined;
    }
}