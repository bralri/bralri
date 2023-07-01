import * as THREE from 'three';
import {GUI} from 'three/lil-gui.esm.min.js';
import {GLTFExporter} from 'three/GLTFExporter.js';
import {DragControls} from 'three/DragControls.js';
import {OrbitControls} from 'three/OrbitControls.js';
import {createAssetInstance} from '../js/_config.min.js';

let scene, camera, renderer, orbitControls;
let amountOfFragments = 16;
let userName; const userNameLength = 30; let updateCharLimit;
const fragments = [];
const uuid = [];

const loading = document.getElementById('loading');
const exporter = new GLTFExporter();

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
    const gui = new GUI({title: "Build-A-Vessel"});
    gui.domElement.id = "gui";
    
    const guiParams = {
        shuffleSelection: () => {
            urlParam();
            loadAssets();
        },
        resetCamera: () => {
            orbitControls.reset();
        },
        downloadVessel: () => {
            exportVesselToDevice();
        },
        takeScreenshot: () => {
            saveAsImage();
        },
        visitArchive: () => {
            window.open('/works/build-a-vessel/archive/');
        },
        setUserName: "Optional",
        submitToArchive: () => {
            exportVesselToCloud();
        },
        amountOfFragments: 16
    }
    
    const controls = gui.addFolder("Controls");
    controls.add(guiParams, "shuffleSelection").name("Shuffle Fragments");
    controls.add(guiParams, "resetCamera").name("Reset Camera");
    controls.add(guiParams, "takeScreenshot").name("Take Screenshot");
    controls.add(guiParams, "downloadVessel").name("Download Vessel");
    controls.add(guiParams, "amountOfFragments", [3, 4, 9, 16, 25]).name("Choose Amount").onChange(
        (value) => {
            amountOfFragments = value;
            urlParam();
            loadAssets();
        }
    );

    const archive = gui.addFolder('Submit to the Archive');

    const userNameControl = archive.add(guiParams, 'setUserName').name(`Your Name (${userNameLength})`);

    const fetchBannedWords = async () => {
        try {
            const response = await fetch('/.netlify/functions/bannedWords');
            const data = await response.json();
            const bannedWords = data.words;
            return bannedWords;
        } catch (error) {
            console.error('Error fetching list: ', error);
        }
    };

    userNameControl.onFinishChange(async (value) => {
        const trimmedString = value.substring(0, userNameLength);
        userName = trimmedString;

        const bannedWords = await fetchBannedWords();
        console.log(bannedWords);

        const isBannedWord = bannedWords.some((word) => {
            const regex = new RegExp(`\\b${word}\\b`, 'i');
            return regex.test(value);
        });

        if (isBannedWord) {
            window.alert('Please choose a different name. The entered name contains banned words.');
        }
    });

    userNameControl.onChange((value) => {
        updateCharLimit = userNameLength - value.length;
        userNameControl.name(`Your Name (${updateCharLimit})`);
    });

    const inputElement = userNameControl.domElement.querySelector('input');
        inputElement.addEventListener('input', () => {
        let inputValue = inputElement.value;
        inputValue = inputValue.replace(/[^a-zA-Z0-9]/g, '');
        if (inputValue.length > userNameLength) {
            inputElement.value = inputValue.substring(0, userNameLength);
        }
    });

    inputElement.addEventListener('keydown', (event) => {
        if (event.key.length === 1 && inputElement.value.length >= userNameLength) {
            event.preventDefault();
        }
    });

    archive.add(guiParams, "submitToArchive").name("Submit your Vessel");
    gui.add(guiParams, "visitArchive").name("Visit the Archive");
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

// Upload Vessel to cloud storage
const exportVesselToCloud = () => {
    const options = {
        binary: true
    };

    exporter.parse(
        scene,
        (result) => {
            saveToCloud(result, `vessel-${uuid[0]}.glb`);
        },
        (error) => {
            console.log('An error occurred during parsing', error);
        },
        options
    );
}
const saveToCloud = (buffer, fileName) => {
    fetch(
        '/.netlify/functions/submission', 
        {
            method: 'POST',
            headers: {
                'Content-Type': 'application/octet-stream',

                // Metadata
                'User-Name': userName,
                'File-Name': fileName,
            },
            body: buffer
        }
    ).then((response) => 
        {
            if (response.ok) {
                console.log('File uploaded successfully!');
                window.alert(`${fileName} successfully uploaded to the Archive!`);
            } else {
                console.log('File upload failed.');
            }
        }
    ).catch((error) => 
        {
            console.log('An error occurred while uploading the file:', error);
        }
    );
}
  
// Download Vessel to user device
const exportVesselToDevice = () => {
    const options = {
        binary: true
    };

    exporter.parse(
        scene,
        (result) => {
            saveToDeviceArrayBuffer(result, `vessel-${uuid[0]}.glb`)
        },
        (error) => {
            console.log('An error occurred during parsing', error);
        },
        options
    );
}
const saveToDeviceArrayBuffer = (buffer, fileName) => {
    saveToDevice(new Blob([buffer], {type: 'application/octet-stream'}), fileName);
}
const saveToDevice = (blob, fileName) => {
    const link = document.createElement('a');
    document.body.appendChild(link);
    link.href = URL.createObjectURL(blob);
    link.download = fileName;
    link.click();
    document.body.removeChild(link);
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