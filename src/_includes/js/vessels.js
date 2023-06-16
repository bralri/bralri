import * as THREE from 'three';
import {GUI} from 'three/lil-gui.esm.min.js';
import {GLTFLoader} from 'three/GLTFLoader.js';
import {GLTFExporter} from 'three/GLTFExporter.js';
import {DragControls} from 'three/DragControls.js';
import {OrbitControls} from 'three/OrbitControls.js';
import {vesselPaths} from '../js/_config.min.js';

let scene, camera, renderer, orbitControls;
let amountOfFragments = 16;
const fragments = [];
const uuid = [];

const loading = document.getElementById('loading');
const modal = document.getElementById('modal');
const span = document.getElementsByClassName("close")[0];

const generateUUID = () => {
    const uuid = Math.floor(Math.random() * 100000);
    return uuid;
}

const urlParam = () => {
    const url = new URL(window.location);
    const newUUID = generateUUID();
    url.searchParams.set('id', newUUID);
    window.history.pushState(null, '', url.toString());

    uuid.length = 0;
    uuid.push(newUUID);
}

const setupGUI = () => {
    const gui = new GUI({title: 'Options'});
    gui.domElement.id = 'gui';
    
    const guiOptions = {
        // Controls
        shuffleSelection: () => {
            const selectedAmount = amountOfFragments;
            const vesselPathsCopy = [...vesselPaths];
            const randomPaths = Array.from({length: selectedAmount}, () => {
                const randomIndex = Math.floor(Math.random() * vesselPathsCopy.length);
                return vesselPathsCopy.splice(randomIndex, 1)[0];
            });
            urlParam();
            loadAssets();
        },
        resetCamera: () => {
            orbitControls.reset();
        },
        downloadVessel: () => {
            downloadVessel();
        },
        takeScreenshot: () => {
            saveAsImage();
        },
        visitArchive: () => {
            window.open('/works/build-a-vessel/archive/');
        },
        submitToArchive: () => {
            window.open('/works/build-a-vessel/submit/');
        },
        submitToArchiveModal: () => {
            openSubmitModal();
        },
        // Settings
        amountOfFragments: 16
    }
    
    const controls = gui.addFolder('Controls');
    controls.add(guiOptions, "shuffleSelection").name("Shuffle Selection");
    controls.add(guiOptions, "resetCamera").name("Reset Camera");
    controls.add(guiOptions, "takeScreenshot").name("Take Screenshot");
    controls.add(guiOptions, "downloadVessel").name("Download Vessel");
    
    const settings = gui.addFolder('Settings');
    settings.add(guiOptions, "amountOfFragments", [3, 4, 9, 16, 25]).name("Amount").onChange(
        (value) => {
            amountOfFragments = value;
            urlParam();
            loadAssets();
        }
    );

    gui.add(guiOptions, "submitToArchiveModal").name("Submit to Archive (Modal)");
    gui.add(guiOptions, "submitToArchive").name("Submit to Archive (Link)");
    gui.add(guiOptions, "visitArchive").name("Visit the Archive");
    
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

const openSubmitModal = () => {
    modal.style.display = "block";
    span.onclick = function() {
        modal.style.display = "none";
    }
    window.onclick = function(event) {
        if (event.target == modal) {
            modal.style.display = "none";
        }
    }
}

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

    orbitControls = new OrbitControls(camera, renderer.domElement);
    orbitControls.update();
    orbitControls.addEventListener('change', render)
    orbitControls.maxDistance = 15;
    orbitControls.enablePan = true;
    orbitControls.panSpeed = 0.5;

    const dragControls = new DragControls(fragments, camera, renderer.domElement);
    dragControls.addEventListener('drag', render);
    dragControls.addEventListener('dragstart', () => {
        orbitControls.enabled = false;
    });
    dragControls.addEventListener('dragend', () => {
        orbitControls.enabled = true;
    });


    window.addEventListener('resize', onWindowResize);

    //

    urlParam();
    setupGUI();
}

const loadAssets = () => {
    const manager = new THREE.LoadingManager();
    const loader = new GLTFLoader(manager);

    fragments.forEach((fragment) => {
        scene.remove(fragment);
    });
    fragments.length = 0;
    
    const vesselPathsCopy = [...vesselPaths];

    const randomPaths = Array.from({length: amountOfFragments}, () => {
        const randomIndex = Math.floor(Math.random() * vesselPathsCopy.length);
        return vesselPathsCopy.splice(randomIndex, 1)[0];
    });

    const gridSize = Math.ceil(Math.sqrt(amountOfFragments));
    const offset = (gridSize - 1) * 3 * 0.5;
  
    randomPaths.forEach((path, i) => {
        loader.load(

            `/assets/models/vessels${path}.glb`,

            (glb) => {
                const fragment = glb.scene;

                const row = Math.floor(i / gridSize);
                const col = i % gridSize;
                const x = (col * 3) - offset;
                const y = (row * 3) - offset;

                fragment.rotation.y = Math.random() * 4 * Math.PI;
                fragment.position.set(x, y, 0);

                scene.add(fragment);
                fragments.push(fragment);
            }
        );
    });
};

const downloadVessel = () => {
    const exporter = new GLTFExporter();
    const options = {
        onlyVisible: true,
        binary: true
    };

    exporter.parse(
        scene,
        (result) => {
            saveArrayBuffer(result, `vessel-${uuid[0]}.glb`)
        },
        (error) => {
            console.log('An error happened during parsing', error);
        },
        options
    );
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
        saveFile(imgData.replace(strMime, strDownloadMime), `vessel-${uuid[0]}.jpg`);
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

const onWindowResize = () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
    animate();
}

const animate = () => {
    requestAnimationFrame(animate);
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