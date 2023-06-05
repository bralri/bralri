import * as THREE from 'three';
import {GLTFLoader} from 'three/GLTFLoader.js';
import {GLTFExporter} from 'three/GLTFExporter.js';
import {DragControls} from 'three/DragControls.js';
import {OrbitControls} from 'three/OrbitControls.js';
import {CSS2DRenderer, CSS2DObject} from 'three/CSS2DRenderer.js'
import {vesselPaths} from '../js/_config.min.js';

let scene, camera, renderer, cssRenderer, group;
let dragControls, orbitControls;
let numCols, numRows;
let vessels = vesselPaths;

const vesselFragments = [];
const vesselTooltip = [];
const vesselID = []
const uuids = [];

const manager = new THREE.LoadingManager();

const mouse = new THREE.Vector2();
const raycaster = new THREE.Raycaster();

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

    cssRenderer = new CSS2DRenderer();
    cssRenderer.setSize(window.innerWidth, window.innerHeight);
    cssRenderer.domElement.style.position = 'absolute';
    cssRenderer.domElement.style.top = '0px';
    cssRenderer.domElement.style.pointerEvents = 'none';
    document.body.appendChild(cssRenderer.domElement);

    orbitControls = new OrbitControls(camera, renderer.domElement);
    orbitControls.update();
    orbitControls.addEventListener('change', render)
    orbitControls.maxDistance = 15;
    orbitControls.enablePan = true;
    orbitControls.panSpeed = 0.5;

    dragControls = new DragControls(vesselFragments, camera, renderer.domElement);
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

    window.addEventListener('mousemove', (e) => {

        mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
        mouse.y = - (e.clientY / window.innerHeight) * 2 + 1;

        raycaster.setFromCamera(mouse, camera);
        const intersects = raycaster.intersectObject(group, true);

        if (intersects[0] && vesselID.indexOf(intersects[0].object.id) !== -1) {

            for (let i = 0; i < vesselTooltip.length; i++) {
                if (intersects[0].object.id === vesselTooltip[i].id) {
                    vesselTooltip[i].p.className = 'tooltip show';
                    vesselTooltip[i].p.textContent = vesselTooltip[i].content;
                    vesselTooltip[i].label.position.set(
                        vesselTooltip[i].fragmentPos.x, 
                        vesselTooltip[i].fragmentPos.y + 1,
                        vesselTooltip[i].fragmentPos.z
                    );
                }
            }

        } else {

            for (let i = 0; i < vesselTooltip.length; i++) {
                vesselTooltip[i].p.className = 'tooltip hide';
            }

        }

        render();
    })

    window.addEventListener('resize', onWindowResize);
}

const generateUUID = () => {
    const uuid = Math.floor(Math.random() * 100000);
    uuids.push(uuid);
    return uuid;
}

const loadAssets = () => {

    group = new THREE.Group();
    scene.add(group);

    if (window.innerWidth > 800) {
        numRows = 3;
        numCols = 5;
    } else {
        numRows = 5;
        numCols = 3;
    }

    for (let i = vessels.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [vessels[i], vessels[j]] = [vessels[j], vessels[i]];
    }

    vessels = vessels.slice(0, 15);

    const loader = new GLTFLoader(manager);
    for (let i = 0; i < vessels.length; i++) {

          loader.load(vessels[i].src, (glb) => {

            const vesselFragment = glb.scene;

            const row = Math.floor(i / numCols);
            const col = i % numCols;
            const x = (col - (numCols - 1) / 2) * 3;
            const y = (row - (numRows - 1) / 2) * 3;

            vesselFragment.rotation.y = Math.random() * 4 * Math.PI;

            if (window.innerWidth > 800) {
                vesselFragment.position.set(x, y, 0);
            } else {
                vesselFragment.position.set(x, y + 1, 0);
            }

            let name = `vessel-fragment-${i + 1}`;
            vesselFragment.name = name;
            vesselFragment.userData.name = name;

            const p = document.createElement('p');
            p.className = 'tooltip';
            const pContainer = document.createElement('div');
            pContainer.className = 'tooltip-container';
            pContainer.appendChild(p);
            const tooltipLabel = new CSS2DObject(pContainer);
            scene.add(tooltipLabel);

            scene.add(vesselFragment);
            group.add(vesselFragment);

            vesselFragments.push(vesselFragment);
            
            vesselID.push(vesselFragment.children[0].id);
            vesselTooltip.push({
                id: vesselFragment.children[0].id,
                p: p,
                content: name,
                label: tooltipLabel,
                fragmentPos: vesselFragment.position
            });
        })
    }
}

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

    cssRenderer.setSize(this.window.innerWidth, this.window.innerHeight);

    animate();
}

const animate = () => {

    requestAnimationFrame(animate);
    render();
}

const render = () => {
    cssRenderer.render(scene, camera);
    renderer.render(scene, camera);
}

window.onload = () => {
    init();
    loadAssets();
    setTimeout(animate, 1000);
    setTimeout(() => {
        loading.classList.add('fade');
    }, 1000);

    console.log(vesselID)
}