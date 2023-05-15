import * as THREE from 'three';
import {GLTFLoader} from 'three/GLTFLoader.js';
import {GLTFExporter} from 'three/GLTFExporter.js';
import {DragControls} from 'three/DragControls.js';
import {OrbitControls} from 'three/OrbitControls.js';

import {vesselAssets} from '../js/_config.min.js';

let scene, camera, renderer, dragControls, orbitControls;
let object, numObjects, numRows, numCols;
const manager = new THREE.LoadingManager();
const modelArray = []; 
const uuidArray = [];

const urlParams = new URLSearchParams(window.location.search);
let groupNumb = parseInt(urlParams.get('id')) > vesselAssets.length ? '0' : 
                parseInt(urlParams.get('id')) <= vesselAssets.length ? parseInt(urlParams.get('id')) : 
                0;
const groupID = window.location.href.split('=').pop();
let currentGroup = vesselAssets[groupNumb];

const loading = document.getElementById('loading');
const downloadButton = document.getElementById('download-glb');
const resetCameraButton = document.getElementById('reset');
const shuffleButton = document.getElementById('shuffle');
const imageScreenshotButton = document.getElementById('save-img');

let sceneReady = false;

function sceneSetup() {

    scene = new THREE.Scene();
    scene.background = new THREE.Color(0x000000);
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 2000);
    if (window.innerWidth <= 800) {
        camera.position.z = 12;
    } else {
        camera.position.z = 10;
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
    orbitControls.addEventListener('change', animate)
    orbitControls.maxDistance = 15;
    orbitControls.enablePan = true;
    orbitControls.panSpeed = 0.5;

    dragControls = new DragControls(modelArray, camera, renderer.domElement);
    dragControls.addEventListener('dragstart', function() {
        orbitControls.enabled = false;
    });
    dragControls.addEventListener('dragend', function() {
        orbitControls.enabled = true;
    });

    window.addEventListener('resize', onWindowResize);

    downloadButton.addEventListener('click', downloadVessel);

    imageScreenshotButton.addEventListener('click', saveAsImage);

    resetCameraButton.addEventListener('click', resetCamera, false);
    document.body.addEventListener('keydown', (event) => {
        if (event.code == "KeyR") {
            resetCamera();
        }
    }, false);

    generateUUID();

    shuffleButton.onclick = function() {
        loading.classList.remove('fade');
        setTimeout(() => {
            window.location.href = `?id=${uuidArray[0]}`;
        }, 1200)
    }

    sceneReady = true;
}

function generateUUID() {

    const uuid = Math.floor(Math.random() * 100000);
    uuidArray.push(uuid);
    return uuid;
}

function loadAssets() {

    let spacing = 3;

    for (let i = currentGroup.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [currentGroup[i], currentGroup[j]] = [currentGroup[j], currentGroup[i]];
    }

    currentGroup = currentGroup.slice(0, 15);
    numObjects = currentGroup.length;

    if (window.innerWidth < 800) {
        numRows = 5;
        numCols = 3;
    } else {
        numRows = 3;
        numCols = 5;
    }

    for (let i = numObjects - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [currentGroup[i], currentGroup[j]] = [currentGroup[j], currentGroup[i]];
    }

    const loader = new GLTFLoader(manager);
    for (let i = 0; i < numObjects; i++) {

        const obj = currentGroup[i];

        loader.load(obj.src, function (glb) {
            object = glb.scene;

            const row = Math.floor(i / numCols);
            const col = i % numCols;
            const x = (col - (numCols - 1) / 2) * spacing;
            const y = (row - (numRows - 1) / 2) * spacing;

            if (window.innerWidth <= 800) {
                object.position.set(x, y + 1, 0);
            } else {
                object.position.set(x, y, 0);
            }

            object.rotation.y = Math.random() * 4 * Math.PI;

            scene.add(object)
            modelArray.push(object);
        })
    }
}

function downloadVessel() {

    const exporter = new GLTFExporter();
    const options = {
        onlyVisible: true,
        binary: true
    };
    exporter.parse(
        scene,
        function(result) {
            saveArrayBuffer(result, `vessel-${groupID}.glb`)
        },
        function (error) {
            console.log('An error happened during parsing', error);
        },
        options
    )
}
function save(blob, fileName) {

    const link = document.createElement('a');
    document.body.appendChild(link);
    link.href = URL.createObjectURL(blob);
    link.download = fileName;
    link.click();
    document.body.removeChild(link);
}
function saveArrayBuffer(buffer, fileName) {

    save(new Blob([buffer], {type: 'application/octet-stream'}), fileName);
}

function saveAsImage() {

    let imgData;

    try {
        const strMime = "image/jpeg";
        const strDownloadMime = "image/octet-stream";
        imgData = renderer.domElement.toDataURL(strMime);
        saveFile(imgData.replace(strMime, strDownloadMime), `vessel-${groupID}.jpg`);
    } catch (e) {
        console.log(e);
        return;
    }
}
function saveFile(strData, fileName) {

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

function resetCamera() {

    orbitControls.reset();
}

function onWindowResize() {

    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);

    animate();
}

function animate() {

    requestAnimationFrame(animate);
    renderer.render(scene, camera);
}

window.onload = function() {
    
    sceneSetup();
    loadAssets();
    setTimeout(animate, 1000);
    setTimeout(() => {
        loading.classList.add('fade');
    }, 1000);

    console.log(`Build-A-Vessel-${groupID} Ready`);
}