let scene, camera, renderer, orbitControls;

const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();

let modelPaths = [
    './models/1.glb', 
    './models/0.glb',
    './models/2.glb', 
    './models/3.glb',  
    './models/5.glb', 
    './models/6.glb',
    './models/4.glb'
];
let i = 0;
let currentModel;

let modelNmb = 1;
let totalModelNmb = modelPaths.length;
document.getElementById("total-model-number").innerHTML = totalModelNmb;

let prevBtn, nextBtn;

let ambientLight, dirLight;
let GLBLoader, manager;

let width = window.innerWidth;
let height = window.innerHeight;
let aspect = width/height;
let fov = 75;
let near = 0.1;
let far = 2000;
let cameraPOS = 30;

const meshColour = new THREE.Color(0xD3D3D3).convertSRGBToLinear();

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

    console.log(camera.position);

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

    dirLight = new THREE.DirectionalLight(0x404040, 2);
    dirLight.position.set(20, 0, 20);
    dirLight.castShadow = true;
    dirLight.shadow.mapSize.width = 2048;
    dirLight.shadow.mapSize.height = 2048;
    dirLight.shadow.camera.near = 0.1;
    dirLight.shadow.camera.far = 500;
    dirLight.shadow.camera.left = -300;
    dirLight.shadow.camera.right = 300;
    dirLight.shadow.camera.top = 300;
    dirLight.shadow.camera.bottom = -300;
    scene.add(dirLight);

    orbitControls = new THREE.OrbitControls(camera, renderer.domElement);
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
                gltf.scene.traverse(function(node) {
                    if (node.isMesh) {
                        node.receiveShadow = true;
                        node.material = new THREE.MeshLambertMaterial({
                            color: meshColour,
                            side: THREE.DoubleSide
                        })
                    }
                })
                currentModel = gltf.scene;
                currentModel.position.y = 0;
                scene.add(currentModel);
        });
    }

    function next() {
        i++;
        load_Model(i);

        if (i == 6) {
            nextBtn.style.visibility = "hidden";
        }
        
        prevBtn.style.visibility = "visible";

        modelNmb += 1;
        document.getElementById("model-number").innerHTML = modelNmb;

        orbitControls.reset();
        camera.position.z = cameraPOS;
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
                gltf.scene.traverse(function(node) {
                    if (node.isMesh) {
                        node.receiveShadow = true;
                        node.material = new THREE.MeshLambertMaterial({
                            color: meshColour,
                            side: THREE.DoubleSide
                        })
                    }
                })
                currentModel = gltf.scene;
                currentModel.position.y = 0;
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
        camera.position.z = cameraPOS;
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