import * as THREE from 'three';
import {GLTFLoader} from 'three/GLTFLoader.js';
import {GLTFExporter} from 'three/GLTFExporter.js';
import {DragControls} from 'three/DragControls.js';
import {OrbitControls} from 'three/OrbitControls.js';
import {vesselPaths} from '../js/_config.min.js';

let scene, camera, renderer;
let dragControls, orbitControls;
let numCols, numRows;

const fragments = [];
const uuids = [];

const manager = new THREE.LoadingManager();

const loading = document.getElementById('loading');
const shuffleButton = document.getElementById('shuffle');
const resetCameraButton = document.getElementById('reset');
const downloadButton = document.getElementById('download-glb');
const imageScreenshotButton = document.getElementById('save-img');

const init = () => {

    scene = new THREE.Scene();
    scene.background = new THREE.Color(0x000000);
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 50);

    if (window.innerWidth > 800) {
        camera.position.z = 10;
    } else {
        camera.position.z = 12;
    }

    renderer = new THREE.WebGLRenderer({
        alpha: true,
        antialias: true,
        preserveDrawingBuffer: true
    });
    renderer.compile(scene, camera);
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);

    orbitControls = new OrbitControls(camera, renderer.domElement);
    orbitControls.update();
    orbitControls.addEventListener('change', render)
    orbitControls.maxDistance = 15;
    orbitControls.enablePan = true;
    orbitControls.panSpeed = 0.5;

    dragControls = new DragControls(fragments, camera, renderer.domElement);
    dragControls.addEventListener('drag', render);
    dragControls.addEventListener('dragstart', () => {
        orbitControls.enabled = false;
    });
    dragControls.addEventListener('dragend', () => {
        orbitControls.enabled = true;
    });

    downloadButton.addEventListener('click', downloadVessel);
    imageScreenshotButton.addEventListener('click', saveAsImage);

    resetCameraButton.addEventListener('click', resetCamera);
    document.body.addEventListener('keydown', (e) => {
        if (e.code == "KeyR") {
            resetCamera();
        }
    });

    generateUUID();

    shuffleButton.onclick = () => {
        loading.classList.remove('fade');
        setTimeout(() => {
            window.location.href = `?id=${uuids[0]}`;
        }, 1200)
    }

    window.addEventListener('resize', onWindowResize);
}

const generateUUID = () => {
    const uuid = Math.floor(Math.random() * 100000);
    uuids.push(uuid);
    return uuid;
}

const loadAssets = () => {
    const loader = new GLTFLoader(manager);
  
    if (window.innerWidth > 800) {
        numRows = 3;
        numCols = 5;
    } else {
        numRows = 5;
        numCols = 3;
    }
  
    const randomPaths = Array.from({length: 15}, () => {
        const randomIndex = Math.floor(Math.random() * vesselPaths.length);
        return vesselPaths.splice(randomIndex, 1)[0];
    });
  
    randomPaths.forEach((path, i) => {
        loader.load(
            `/assets/models/vessels${path}.glb`,
            (glb) => {
                const fragment = glb.scene;

                const row = Math.floor(i / numCols);
                const col = i % numCols;
                const x = (col - (numCols - 1) / 2) * 3;
                const y = (row - (numRows - 1) / 2) * 3;

                fragment.rotateY(Math.random() * 4 * Math.PI);

                if (window.innerWidth > 800) {
                    fragment.position.set(x, y, 0);
                } else {
                    fragment.position.set(x, y + 1, 0);
                }

                scene.add(fragment);

                fragments.push(fragment);
            }
        );
    });
};
  

const downloadVessel = () => {
    const exporter = new GLTFExporter(manager);
    const options = {
        onlyVisible: true,
        binary: true
    };

    exporter.parse(
        scene,
        (result) => {
            saveArrayBuffer(result, `vessel-${uuids[0]}.glb`)
        },
        (error) => {
            console.log('An error happened during parsing', error);
        },
        options
    )
}

const save = (blob, fileName) => {
    const link = document.createElement('a');
    document.body.appendChild(link);
    link.href = URL.createObjectURL(blob);
    link.download = fileName;
    link.click();
    document.body.removeChild(link);
}

const saveArrayBuffer = (buffer, fileName) => {
    save(new Blob([buffer], {type: 'application/octet-stream'}), fileName);
}

const saveAsImage = () => {
    let imgData;
    try {
        const strMime = "image/jpeg";
        const strDownloadMime = "image/octet-stream";
        imgData = renderer.domElement.toDataURL(strMime);
        saveFile(imgData.replace(strMime, strDownloadMime), `vessel-${uuids[0]}.jpg`);
    } catch (error) {
        console.log('An error happened during parsing', error);
        return;
    }
}

const saveFile = (strData, fileName) => {

    const link = document.createElement('a');
    if (typeof link.download === 'string') {
        document.body.appendChild(link);
        link.download = fileName;
        link.href = strData;
        link.click();
        document.body.removeChild(link);
    } else {
        location.replace(uri);
    };
}

const resetCamera = () => {
    orbitControls.reset();
}

const onWindowResize = () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);

    animate();
}

const animate = () => {

    requestAnimationFrame(animate);
    render();
}

const render = () => {
    renderer.render(scene, camera);
}

window.onload = () => {
    init();
    loadAssets();
    setTimeout(animate, 1000);
    setTimeout(() => {
        loading.classList.add('fade');
    }, 1000);
}