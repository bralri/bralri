import * as THREE from 'three';
import {GLTFLoader} from 'three/GLTFLoader.js';
import {GLTFExporter} from 'three/GLTFExporter.js';
import {DragControls} from 'three/DragControls.js';
import {OrbitControls} from 'three/OrbitControls.js';

import { vesselAssets } from '../js/_config.min.js';

let scene, camera, renderer, dragControls, orbitControls;
let object, numObjects, numRows, numCols;
const manager = new THREE.LoadingManager();
let modelArray = []; const uuidArray = [];

let sceneReady = false, exitRoom = false;

const urlParams = new URLSearchParams(window.location.search);
let groupNumb = parseInt(urlParams.get('id')) > vesselAssets.length ? '0' : parseInt(urlParams.get('id')) <= vesselAssets.length ? parseInt(urlParams.get('id')) : 0;
const groupID = window.location.href.split('=').pop();
let currentGroup = vesselAssets[groupNumb];

const btn = document.getElementById('download-glb');
const loading = document.getElementById('loading');
const resetCameraButton = document.getElementById('reset');
const shuffleButton = document.getElementById('shuffle');

function sceneSetup() {
    // Scene
    scene = new THREE.Scene();
    scene.background = new THREE.Color(0x000000);
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 2000);
    if (window.innerWidth <= 800) {
        camera.position.z = 12;
    } else {
        camera.position.z = 10;
    }

    // Renderer
    renderer = new THREE.WebGLRenderer({
        alpha: true,
        antialias: true 
    });
    renderer.compile(scene, camera);
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);

    // Controls
    // Orbit
    orbitControls = new OrbitControls(camera, renderer.domElement);
    orbitControls.update();
    orbitControls.addEventListener('change', render)
    orbitControls.maxDistance = 15;
    orbitControls.enablePan = true;
    orbitControls.panSpeed = 0.5;

    // Drag
    dragControls = new DragControls(modelArray, camera, renderer.domElement);
    dragControls.addEventListener('dragstart', function() {
        orbitControls.enabled = false;
    });
    dragControls.addEventListener('dragend', function() {
        orbitControls.enabled = true;
    });

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff);
    scene.add(ambientLight);

    window.addEventListener('resize', onWindowResize);

    // Buttons
    // Download vessel
    btn.addEventListener('click', downloadVessel);

    // Reload Scene
    document.body.addEventListener('keydown', function(event) {
        if (event.which == 82) { // R
            resetCamera();
        }
    }, false);
    resetCameraButton.addEventListener('click', resetCamera, false);

    generateUUID();

    shuffleButton.onclick = function() {
        loading.classList.remove('fade');
        setTimeout(function () {
            window.location.href = `?id=${uuidArray[0]}`;
        }, 1200)
    }

    sceneReady = true;
    exitRoom = true;
}

function generateUUID() {
    const uuid = Math.floor(Math.random() * 100000);
    uuidArray.push(uuid);
    return uuid;
}

function loadAssets() {

    // Define grid parameters
    let spacing = 3;

    for (let i = currentGroup.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [currentGroup[i], currentGroup[j]] = [currentGroup[j], currentGroup[i]];
        }

    currentGroup = currentGroup.slice(0, 15);
    numObjects = currentGroup.length;

    if (window.innerWidth < 800) { // adjust grid parameters for mobile screens
        numRows = 5;
        numCols = 3;
    } else {
        numRows = 3;
        numCols = 5;
    }

    // Shuffle array
    for (let i = numObjects - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [currentGroup[i], currentGroup[j]] = [currentGroup[j], currentGroup[i]];
    }

    // Load models
    const loader = new GLTFLoader(manager);
    for (let i = 0; i < numObjects; i++) {

        const obj = currentGroup[i];

        loader.load(obj.src, function (glb) {
            object = glb.scene;
            const row = Math.floor(i / numCols);
            const col = i % numCols;

            // Set position based on grid index
            const x = (col - (numCols - 1) / 2) * spacing;
            const y = (row - (numRows - 1) / 2) * spacing;

            if (window.innerWidth <= 800) {
                object.position.set(x, y + 1, 0);
            } else {
                object.position.set(x, y, 0);
            }

            // Set random rotation
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

const link = document.createElement('a');
link.style.display = 'none';
document.body.appendChild(link);

function save(blob, fileName) {
    link.href = URL.createObjectURL(blob);
    link.download = fileName;
    link.click();
}

function saveArrayBuffer(buffer, fileName) {
    save(new Blob([buffer], {type: 'application/octet-stream'}), fileName);
}

function resetCamera() {
    orbitControls.reset();
}

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);

    render();
}

function animate() {
    requestAnimationFrame(animate);
    render();
}

function render() {
    renderer.render(scene, camera);
}

window.onload = function() {
    sceneSetup();
    loadAssets();
    setTimeout(animate, 1000);
    setTimeout(function() {
        loading.classList.add('fade');
    }, 1000);

    console.log(`Build-A-Vessel-${groupID} Ready`);
}