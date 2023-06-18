import * as THREE from 'three';
import {GUI} from 'three/lil-gui.esm.min.js';
import {MapControls} from 'three/MapControls.js';
import {archive, createAssetInstance} from '../js/_archive.min.js';

let camera, mapControls, scene, renderer;
const mouse = new THREE.Vector2();
const objects = []; const objectsId = [];

const setupGUI = () => {
    const gui = new GUI();
    gui.domElement.id = 'gui';

    const guiParams = {
        build_a_vessel: () => {
            window.open('/works/build-a-vessel/')
        },
        resetCamera: () => {
            mapControls.reset();
            mapControls.object.position.set(400, 200, 0);
        }
    }

    gui.add(guiParams, "resetCamera").name("Reset");
    gui.add(guiParams, "build_a_vessel").name("Build-A-Vessel");

    gui.$title.title = gui.$title.innerHTML;
    gui.children.forEach((child) => {
        if (!child.children) {
            child.domElement.title = child.$name.innerHTML;
        } else {
            let parent = child;
            parent.children.forEach((child) => {
                child.domElement.title = child.$name.innerHTML;
            })
        }
    
        if (child.$title) {
            child.$title.title = child.$title.innerHTML
        }
    })
}

const init = () => {
    scene = new THREE.Scene();
    scene.background = new THREE.Color(0xcccccc);
    scene.fog = new THREE.FogExp2(0xcccccc, 0.002);

    renderer = new THREE.WebGLRenderer({antialias: true});
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);

    camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 1, 1000);

    // controls
    mapControls = new MapControls(camera, renderer.domElement);
    mapControls.enableDamping = true;
    mapControls.dampingFactor = 0.05;
    mapControls.screenSpacePanning = false;
    mapControls.minDistance = 100;
    mapControls.maxDistance = 500;
    mapControls.maxPolarAngle = Math.PI / 2;
    mapControls.object.position.set(400, 200, 0);

    // lights
    const dirLight1 = new THREE.DirectionalLight(0xffffff);
    dirLight1.position.set(1, 1, 1);
    scene.add(dirLight1);

    const dirLight2 = new THREE.DirectionalLight(0x002288);
    dirLight2.position.set(-1, -1, -1);
    scene.add(dirLight2);

    const ambientLight = new THREE.AmbientLight(0x222222);
    scene.add(ambientLight);

    //

    window.addEventListener('resize', onWindowResize);
    window.addEventListener('mousemove', onMouseMove);

    //

    setupGUI();
}

const loadAssets = () => {
    const gridSize = Math.ceil(Math.sqrt(archive.length));
    const spacing = 600;
    const offset = (gridSize - 1) * spacing * 0.5;

    const assetInstance = createAssetInstance(item.id);
    assetInstance.then((instance) => {
        const row = Math.floor(i / gridSize);
        const col = i % gridSize;
        const x = (col * spacing) - offset;
        const z = (row * spacing) - offset;

        instance.mesh.position.set(x, 50, z);
        instance.mesh.scale.set(40, 40, 40);
        instance.mesh.rotateY(Math.PI / -1.5);

        scene.add(instance.mesh);

        objects.push(instance.mesh);
        objectsId.push(instance.mesh.userData.id);
    }).catch((error) => {
        console.log(error);
    })
}

const onWindowResize = () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}

const onMouseMove = (e) => {
	mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
	mouse.y = -(e.clientY / window.innerHeight) * 2 + 1;
}

const animate = () => {
    const raycaster = new THREE.Raycaster();
    raycaster.setFromCamera(mouse, camera);
    const intersects = raycaster.intersectObjects(objects);
    if (intersects[0] && objectsId.includes(intersects[0].object.parent.parent.id) !== -1) {
        objects.forEach((asset) => {
            if (intersects[0].object.parent.parent.id === asset.userData.id) {
                document.querySelector('#caption p').innerHTML = asset.userData.caption;
            }
        });
        document.body.style.cursor = 'pointer';
        document.getElementById('caption').style.display = 'block';
    } else {
        document.body.style.cursor = '';
        document.getElementById('caption').style.display = '';
    };

    // document.querySelector('.co-ord').innerHTML =  Math.round(controls.object.position.x) + ", " + Math.round(controls.object.position.y) + ", " + Math.round(controls.object.position.z);

    requestAnimationFrame(animate);
    mapControls.update();
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