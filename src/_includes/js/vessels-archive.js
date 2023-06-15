import * as THREE from 'three';
import {MapControls} from 'three/MapControls.js';
import {GLTFLoader} from 'three/GLTFLoader.js'
import {archive} from '../js/_archive.min.js';

let camera, controls, scene, renderer;
const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();
const objects = []; const objectsID = [];

const init = () => {

    scene = new THREE.Scene();
    scene.background = new THREE.Color(0xcccccc);
    scene.fog = new THREE.FogExp2(0xcccccc, 0.002);

    renderer = new THREE.WebGLRenderer({
        antialias: true
    });
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);

    camera = new THREE.PerspectiveCamera(
        60, 
        window.innerWidth / window.innerHeight, 
        1, 1000
    );
    camera.position.set(400, 200, 0);

    // controls
    controls = new MapControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.screenSpacePanning = false;
    controls.minDistance = 100;
    controls.maxDistance = 500;
    controls.maxPolarAngle = Math.PI / 2;

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
}

const loadAssets = () => {
    const manager = new THREE.LoadingManager();
    const loader = new GLTFLoader(manager);

    shuffle(archive);

    const gridSize = Math.ceil(Math.sqrt(archive.length));
    const spacing = 350;
    const offset = (gridSize - 1) * spacing * 0.5;

    archive.forEach((asset, i) => {
        loader.load(

            `/assets/models/vessels/archive/vessel-${asset.id}.glb`,

            (glb) => {
                const model = glb.scene;

                const row = Math.floor(i / gridSize);
                const col = i % gridSize;
                const x = (col * spacing) - offset;
                const z = (row * spacing) - offset;

                model.position.set(x, 40, z);
                model.scale.set(20, 20, 20);
                model.rotateY(Math.PI / 2);

                model.userData = {
                    id: model.id,
                    caption: 
                    `                                
                        <span class="title">vessel-${asset.id}</span><br>
                        <i class="author">by ${asset.author}</i><br>
                    `
                };

                scene.add(model);
                objects.push(model);
                objectsID.push(model.id);
            }
        );
    });
};

const shuffle = (array) => {
    array.forEach((_, i) => {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    });
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

    raycaster.setFromCamera(mouse, camera);
    const intersects = raycaster.intersectObjects(objects);
    if (intersects[0] && objectsID.indexOf(intersects[0].object.parent.parent.id) !== -1) {
        objects.forEach((asset) => {
            if (intersects[0].object.parent.parent.id === asset.userData.id) {
                document.querySelector('#caption p').innerHTML = asset.userData.caption;
            }
        });
        document.getElementById('caption').style.display = 'block';
    } else {
        document.getElementById('caption').style.display = 'none';
    };

    requestAnimationFrame(animate);
    controls.update();
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