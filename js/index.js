let model;

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
    75, 
    window.innerWidth/window.innerHeight, 
    0.1, 
    1000
);
camera.position.set(0, -0.3, 0);
camera.rotation.x = 90;
camera.rotation.z = 90;


const renderer = new THREE.WebGLRenderer({
    alpha: true,
    antialias: true
});
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

renderer.outputEncoding = THREE.sRGBEncoding;

window.addEventListener('resize', function() {
    const width = window.innerWidth;
    const height = window.innerHeight;
    renderer.setSize(width, height);
    camera.aspect = width/height;
    camera.updateProjectionMatrix();
});

const controls = new THREE.OrbitControls(camera, renderer.domElement)
controls.enabled = false;

let manager = new THREE.LoadingManager(() => {
    const loadingScreen = document.getElementById('loading-screen');
    loadingScreen.classList.add('fade-out');
    loadingScreen.addEventListener('transitionend', onTransitionEnd);
});

const loader = new THREE.GLTFLoader(manager);
loader.load(
    
    '/metamorphosis/1/models/1.glb',

    function(gltf) {
        model = gltf.scene
        model.position.set(0, -1, 0)
        scene.add(model)
    }
);

const isMouseDown = false;

function init(){
    window.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mouseup', onMouseUp);
}

function onMouseDown() {
    isMouseDown = true;
}

function onMouseUp() {
    isMouseDown = false;
}

const update = function() {
    if(model) {
        model.rotation.y += 0.002;
    };
};

const render = function() {
    renderer.render(scene, camera);
};

const GameLoop = function() {
    requestAnimationFrame(GameLoop);
    update();
    render();
};

function onTransitionEnd(transition) {
    transition.target.remove();
}

GameLoop();