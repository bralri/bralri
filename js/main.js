import * as THREE from './three.js';
import {OrbitControls} from './OrbitControls.js';
import {GLTFLoader} from './GLTFLoader.js';

let scene, camera, controls, renderer;

init()
animate()

function init(){

    //camera
    camera = new THREE.PerspectiveCamera(60, window.innerWidth/window.innerHeight, 1, 1000);
    camera.getWorldPosition.set(0,0,0);

    //renderer
    renderer = new THREE.WebGLRenderer({
        antialias: true
    });
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);
    //renderer.shadowMap.enabled = true;
	//renderer.shadowMap.type = THREE.PCFSoctShadowMap;
    document.body.appendChild(renderer.domElement);

    //controls
    controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.screenSpacePanning = false;
    controls.minDistance = 1;
    controls.maxDistance = 5;
    controls.maxPolarAngle = Math.PI/2;
    controls.target.set(0,0,0);
    controls.update();

    //scene
    scene = new THREE.Scene()
    scene.background = new THREE.Color(0xffffff); //set background colour
    scene.add(dirLight);
    scene.add(ambLight);

    //lighting
    const dirLight = new THREE.DirectionalLight(0xffffff);
    dirLight.getWorldPosition.set(1,1,0);

    const ambLight = new THREE.AmbientLight(0xffffff);
    ambLight.position.set(1,1,1);

    //3D Model
    var loader = new GLTFLoader();
    loader.load(
        'model/NLTHI_V1.glb',

        function (NLTHI) {

            NLTHI.scene.traverse(function(node){
                //if shadows
        });
        NLTHI.scene.scale.set(5,5,5);
        NLTHI.scene.position.set(0,0,0);

        scene.add(NLTHI.scene);
        }
    );
    window.addEventListener('resize', onWindowResize, false);
}

function onWindowResize(){
    camera.aspect = window.innerWidth/window.innerHeight;
    camera.updateProjectionMatrix();

    renderer.setSize(window.innerWidth,window.innerHeight);
}

function animate(){
    requestAnimationFrame(animate);
    render();
}

function render(){
    renderer.render(scene, camera);
}