let scene, camera, renderer, dragControls, orbitControls, object, numObjects;
const manager = new THREE.LoadingManager();
let modelArray = [];

let sceneReady = false, exitRoom = false;

const urlParams = new URLSearchParams(window.location.search);
let groupNumb = parseInt(urlParams.get('group')) > vesselAssets.length ? '0' : parseInt(urlParams.get('group')) <= vesselAssets.length ? parseInt(urlParams.get('group')) : 0;
let currentGroup = vesselAssets[groupNumb];

const btn = document.getElementById('download-glb');
const loading = document.getElementById('loading');
const overlay = document.getElementById('overlay');
const reloadButton = document.getElementById('reload');
const switchButton = document.querySelectorAll('#switch');
const shuffleButton = document.getElementById('shuffle');

function sceneSetup() {
    // Scene
    scene = new THREE.Scene();
    scene.background = new THREE.Color(0x000000);
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 2000);
    camera.position.z = 10;

    // Renderer
    renderer = new THREE.WebGLRenderer({
        alpha: true,
        antialias: true 
    });
    renderer.compile(scene, camera);
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.outputEncoding = THREE.sRGBEncoding;
    document.body.appendChild(renderer.domElement);

    window.addEventListener('resize', onWindowResize);

    // Controls
    orbitControls = new THREE.OrbitControls(camera, renderer.domElement);
    orbitControls.maxDistance = 10;
    orbitControls.enablePan = true;
    orbitControls.panSpeed = 0.5;

    dragControls = new THREE.DragControls(modelArray, camera, renderer.domElement);
    dragControls.addEventListener('dragstart', function() {
        orbitControls.enabled = false;
    });
    dragControls.addEventListener('dragend', function() {
        orbitControls.enabled = true;
    });

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff);
    scene.add(ambientLight);

    // Buttons
    // Download vessel
    btn.addEventListener('click', downloadVessel);

    // Reload Scene
    document.body.addEventListener('keydown', function(event) {
        if (event.which == 82) { // R
            reloadScene();
        }
    }, false);
    reloadButton.addEventListener('click', reloadScene, false);

    // Switch group
    for (let i = 0; i < switchButton.length; i++) {
        switchButton[i].addEventListener('click', function() {
            groupNumb = switchButton[i].textContent || switchButton[i].innerText;
        }, false)

        switchButton[i].onclick = function() {
            overlay.classList.add('fade');
            loading.classList.remove('fade');
            setTimeout(function () {
                window.location.href = `?group=${groupNumb}`;
            }, 1200)
        }
    }

    shuffleButton.addEventListener('click', function() {
        groupNumb = 5;
    }, false)
    shuffleButton.onclick = function() {
        overlay.classList.add('fade');
        loading.classList.remove('fade');
        setTimeout(function () {
            window.location.href = `?group=${groupNumb}`;
        }, 1200)
    }

    sceneReady = true;
    exitRoom = true;

    overlay.classList.remove('loading');
}

function loadAssets() {
    // Define grid parameters
    let spacing = 3;
    let numRows = 3;
    let numCols = Math.ceil(numObjects / numRows);

    if (groupNumb !== 5) {
        numObjects = currentGroup.length;
    } else {
        for (let i = currentGroup.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [currentGroup[i], currentGroup[j]] = [currentGroup[j], currentGroup[i]];
        }

        currentGroup = currentGroup.slice(0, 18);
        numObjects = currentGroup.length;
    }

    const aspectRatio = window.innerWidth / window.innerHeight;

    if (window.innerWidth < 768) { // adjust grid parameters for mobile screens
        spacing = 2;
        numRows = Math.max(2, Math.ceil(Math.sqrt(numObjects) / aspectRatio));
        numCols = Math.ceil(numObjects / numRows);
    } else {
        numRows = Math.max(3, Math.ceil(Math.sqrt(numObjects) / aspectRatio));
        numCols = Math.ceil(numObjects / numRows);
    }

    // Shuffle array
    for (let i = numObjects - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [currentGroup[i], currentGroup[j]] = [currentGroup[j], currentGroup[i]];
    }

    // Load models
    const loader = new THREE.GLTFLoader(manager);
    for (let i = 0; i < numObjects; i++) {

        const obj = currentGroup[i];

        loader.load(obj.src, function (glb) {
            object = glb.scene;
            const row = Math.floor(i / numCols);
            const col = i % numCols;

            // Set position based on grid index
            const x = (col - (numCols - 1) / 2) * spacing;
            const y = (row - (numRows - 1) / 2) * spacing;
            object.position.set(x, y, 0);

            if (window.innerWidth < 768) {
                object.position.set(x, y + 1, 0);
            }

            // Set random rotation
            object.rotation.y = Math.random() * 4 * Math.PI;

            scene.add(object);
            modelArray.push(object);
        })
    }
}


function downloadVessel() {
    const exporter = new THREE.GLTFExporter();
    exporter.parse(
        scene,
        function(result) {
            saveArrayBuffer(result, 'Vessel.glb')
        },
        {
            binary: true
        }
    )
}

function saveArrayBuffer(buffer, fileName) {
    save(new Blob([buffer], {type: 'application/octet-stream'}), fileName);
}

const link = document.createElement('a');
document.body.appendChild(link);

function save(blob, fileName) {
    link.href = URL.createObjectURL(blob);
    link.download = fileName;
    link.click();
}

function reloadScene() {
    window.location.reload();
}

function animate() {
    requestAnimationFrame(animate);
    renderer.render(scene, camera);
}

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}

window.onload = function() {
    sceneSetup();
    loadAssets();
    setTimeout(animate, 1000);
    setTimeout(function() {
        loading.classList.add('fade');
    }, 1000);

    console.log(`Group ${groupNumb}: Ready`);
}