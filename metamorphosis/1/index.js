let scene, camera, renderer, orbitControls;

const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();

let modelPaths = [
    './models/0.glb',
    './models/1.glb', 
    './models/2.glb', 
    './models/3.glb', 
    './models/4.glb', 
    './models/5.glb', 
    './models/6.glb', 
    './models/7.glb', 
    './models/8.glb', 
    './models/9.glb', 
    './models/10.glb', 
    './models/11.glb', 
    './models/12.glb', 
    './models/13.glb', 
    './models/14.glb', 
    './models/15.glb',
    './models/16.glb',
    './models/17.glb',
    './models/18.glb',
    './models/19.glb',
    './models/20.glb'
];
let i = 0;
let currentModel;

let modelNmb = 1;
let totalModelNmb = modelPaths.length;
document.getElementById("total-model-number").innerHTML = totalModelNmb;

let prevBtn, nextBtn;

let ambientLight;
let GLBLoader, manager;

let width = window.innerWidth;
let height = window.innerHeight;
let aspect = width/height;
let fov = 75;
let near = 0.1;
let far = 2000;
let cameraPOS = 2.5;

//

init();
update();

function init() {
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(
        fov,
        aspect,
        near,
        far
    );
    camera.position.z = cameraPOS;

    renderer = new THREE.WebGLRenderer({
        alpha: true,
        antialiad: true
    });
    renderer.setSize(width, height);
    document.body.appendChild(renderer.domElement);
    renderer.outputEncoding = THREE.sRGBEncoding;

    window.addEventListener('resize', function() {
        let width = window.innerWidth;
        let height = window.innerHeight;
        let aspect = width/height;
        renderer.setSize(width, height);
        camera.aspect = aspect;
        camera.updateProjectionMatrix();
    })

    ambientLight = new THREE.AmbientLight(0x404040, 1);
    scene.add(ambientLight);

    orbitControls = new THREE.OrbitControls(camera, renderer.domElement);
    orbitControls.maxDistance = 3.5;
    orbitControls.minDistance = 0.5;
    orbitControls.enablePan = false;

    loading_Manager();
    next_Button();
    prev_Button();
}

function loading_Manager() {
    manager = new THREE.LoadingManager(() => {
        const loadingScreen = document.getElementById('loading-screen');
        loadingScreen.classList.add('fade-out');
        loadingScreen.addEventListener('transitionend', onTransitionEnd);
    });
}

function next_Button() {
    nextBtn = document.getElementById('next-button');
    nextBtn.addEventListener('click', next);

    function load_Model(index) {
        if (currentModel) {
            scene.remove(currentModel);
        }
        GLBLoader = new THREE.GLTFLoader(manager);
        GLBLoader.load(
            modelPaths[index], 
            
            function(gltf) {
                currentModel = gltf.scene;
                currentModel.position.y = 0;
                scene.add(currentModel);
        });
    }

    function next() {
        i++;
        load_Model(i);

        if (i == 20) {
            nextBtn.style.visibility = "hidden";
        }
        
        prevBtn.style.visibility = "visible";

        modelNmb += 1;
        document.getElementById("model-number").innerHTML = modelNmb;

        orbitControls.reset();
    }

    load_Model(i);
}

function prev_Button() {
    prevBtn = document.getElementById('prev-button');
    prevBtn.addEventListener('click', prev);

    function load_Model(index) {
        if (currentModel) {
            scene.remove(currentModel);
        }
        GLBLoader = new THREE.GLTFLoader(manager);
        GLBLoader.load(
            modelPaths[index], 
            
            function(gltf) {
                currentModel = gltf.scene;
                scene.add(currentModel);
        });
    }

    function prev() {
        i--;
        load_Model(i);

        if (i == 0) {
            prevBtn.style.visibility = "hidden";
        }

        nextBtn.style.visibility = "visible";

        modelNmb -= 1;
        document.getElementById("model-number").innerHTML = modelNmb;

        orbitControls.reset();
    }
}

function update() {
    requestAnimationFrame(update);
    render();

    if (currentModel) {
        currentModel.rotation.y += 0.002;
    }
}

function render() {
    renderer.render(scene, camera);
}

function onTransitionEnd(transition) {
    transition.target.remove();
}