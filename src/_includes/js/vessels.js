import * as THREE from 'three';
import {GUI} from 'three/lil-gui.esm.min.js';
import {GLTFExporter} from 'three/GLTFExporter.js';
import {DragControls} from 'three/DragControls.js';
import {OrbitControls} from 'three/OrbitControls.js';
import {createAssetInstance} from '../js/_config.min.js';

let scene, camera, renderer, orbitControls;
let amountOfFragments = 16;
const fragments = [];
const uuid = [];

const loading = document.getElementById('loading');

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
    const gui = new GUI({title: "Options"});
    gui.domElement.id = 'gui';
    
    const guiParams = {
        shuffleSelection: () => {
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
            // saveVesselToServer();
            helloworld();
        },
        amountOfFragments: 16
    }
    
    const controls = gui.addFolder('Controls');
    controls.add(guiParams, "shuffleSelection").name("Shuffle");
    controls.add(guiParams, "resetCamera").name("Reset");
    controls.add(guiParams, "takeScreenshot").name("Screenshot");
    controls.add(guiParams, "downloadVessel").name("Download");
    controls.add(guiParams, "amountOfFragments", [3, 4, 9, 16, 25]).name("Amount").onChange(
        (value) => {
            amountOfFragments = value;
            urlParam();
            loadAssets();
        }
    );

    const archive = gui.addFolder('Archive');
    // archive.add(guiParams, "visitArchive").name("Visit");
    archive.add(guiParams, "submitToArchive").name("Submit");
    
    gui.$title.title = gui.$title.innerHTML;
    gui.children.forEach((child) => {
        if (!child.children) {
            child.domElement.title = child.$name.innerHTML;
            child.domElement.tabIndex = 0;
            child.domElement.ariaLabel = `Open ${child.$name.innerHTML}`;
        } else {
            let parent = child;
            parent.children.forEach((child) => {
                child.domElement.title = child.$name.innerHTML;
                child.domElement.tabIndex = 0;
                child.domElement.ariaLabel = `Open ${child.$name.innerHTML}`;
            })
        }
    
        if (child.$title) {
            child.$title.title = child.$title.innerHTML
            child.domElement.tabIndex = 0;
            child.domElement.ariaLabel = `Open ${child.$title.innerHTML}`;
        }
    })
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

const pickAssetNum = (amount) => {
    let pickedNums = [];

    while (pickedNums.length < amount) {
        const num = Math.floor(Math.random() * 81) + 1;

        if (!pickedNums.includes(num)) {
            pickedNums.push(num);
        }
    }

    return pickedNums;
}

const loadAssets = () => {
    fragments.forEach((fragment) => {
        scene.remove(fragment);
    });
    fragments.length = 0;

    const gridSize = Math.ceil(Math.sqrt(amountOfFragments));
    const offset = (gridSize - 1) * 3 * 0.5;

    const assetNum = pickAssetNum(amountOfFragments);
    assetNum.forEach((id, i) => {
        const assetInstance = createAssetInstance(id);
        assetInstance.then((instance) => {
            const row = Math.floor(i / gridSize);
            const col = i % gridSize;
            const x = (col * 3) - offset;
            const y = (row * 3) - offset;

            instance.mesh.rotation.y = Math.random() * 4 * Math.PI;
            instance.mesh.position.set(x, y, 0);

            scene.add(instance.mesh);
            fragments.push(instance.mesh);
        }).catch((error) => {
            console.log(error);
        })
    })
};

const helloworld = () => {
    fetch('/.netlify/functions/hello-world')
}

// Save user created vessel to server
const saveVesselToServer = () => {
    const exporter = new GLTFExporter();
    const options = {
        onlyVisible: true,
        binary: true
    };

    exporter.parse(
        scene,
        (result) => {
            saveToServer(result, `vessel-${uuid[0]}.glb`);
        },
        (error) => {
            console.log('An error occurred during parsing', error);
        },
        options
    );
}
const saveToServer = (buffer, fileName) => {
    fetch('/.netlify/functions/upload', {
        method: 'POST',
        body: buffer
    }).then((response) => {
        if (response.ok) {
            console.log(`File ${fileName} saved to server successfully.`);
            window.alert(`Submitted ${fileName} successfully`);
        } else {
            console.log('Error saving file to server.');
            window.alert(`Error submitting vessel, try again.`);
        }
    }).catch((error) => {
        console.log('An error occurred while saving the file to the server:', error);
    })
}

// Download Vessel to user device
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
            console.log('An error occurred during parsing', error);
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

// Save screenshot of scene to user device
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