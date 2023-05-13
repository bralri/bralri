---
title: "how it was made"
type: "BlogPosting"
date: 2023-05-13
year: "2023"
tags: ["post"]
description: "how build-a-vessel was made"
thumbnail: "/assets/img/blog/how-it-was-made/post-thumbnail.webp"
---

<p class="indent">The idea for <a href="/works/build-a-vessel/">Build-A-Vessel</a> came about whilst I was working on a now defunct project that I have since lost interest in because my brain is like a magpie and once a new shiny idea comes along whatever it is I am currently working on falls by the wayside, during this project I was looking at ideas for how I could use <a href="https://threejs.org">THREE.js</a> <sup><i class="fa-solid fa-arrow-up-right-from-square icon-grey"></i></sup> (a javascript 3D library) to display a series of models on my website in an interesting way.

While browsing the online documentation and examples i came across a series of object/scene controls, one in particular that seemed interesting is called <a href="https://threejs.org/examples/?q=controls#misc_controls_drag">DragControls.js</a> <sup><i class="fa-solid fa-arrow-up-right-from-square icon-grey"></i></sup>, essentially these controls enabled you to populate a THREE.js Scene (which is the “world space” that all of the THREE.js 3D magic happens) with various objects and models, and then you are able to literally drag the scene objects around the screen however you like.

So I thought well what if instead of cubes I replaced them with my models, but my models were too big and when they were added into the scene in the same way as the cubes are in that example, it just turned into a big jumbled mess. So I decided to cut up the models into sections so the individual pieces would be smaller, and the Build-A-Vessel idea was born. 

The original idea for the models used in build-a-vessel were to imagine future objects which could be human sized or hand-held, and to leave their function and utility a mistery. Much like objects and artifacts found through discovery and archeological digs these future vessels are future artifacts. So having them be broken up into spliced objects, futher obscuring their purpose and design, they become fragments of something that once was or will be. Breaking them up and arranging them into a grid much like you would when categorising and identifying archeological finds. With Build-A-Vessel it is now your job to put the pieces back together.</p>

<br>

<hr>

<br>

<p>To start, I mostly copied the drag controls example on the THREE.js website, but instead of using cubes I instead I import all of the vessel asset paths from an array called vesselAssets from _config.min.js, and I then set-up a basic scene including the DragControls, and I load in the .glb models using a basic forLoop which loops through all of the models from the vesselAssets array and once they have been loaded into the scene the object3D models get pushed to the main modelArray which is then used by the DragControls to set which objects will be able to be dragged by these controls:</p>

<pre>
<code>
/* vessels.min.js */


import * as THREE from 'three';
import {GLTFLoader} from 'three/GLTFLoader.js';
import {DragControls} from 'three/DragControls.js';

import {vesselAssets} from '../js/_config.min.js';

let scene, camera, renderer, dragControls;
const manager = new THREE.LoadingManager();
let object;
let modelArray = [];
let sceneReady = false;

const urlParams = new URLSearchParams(window.location.search);
let groupNumb = parseInt(urlParams.get('id')) > vesselAssets.length ? '0' : 
                parseInt(urlParams.get('id')) <= vesselAssets.length ? parseInt(urlParams.get('id')) : 
                0;
let currentGroup = vesselAssets[groupNumb];

const loading = document.getElementById('loading');

function sceneSetup() {
    /* scene */
    scene = new THREE.Scene();
    scene.background = new THREE.Color(0x000000);
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 2000);

    /* renderer */
    renderer = new THREE.WebGLRenderer({
        alpha: true,
        antialias: true 
    });
    renderer.compile(scene, camera);
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);

    /* drag controls */
    dragControls = new DragControls(modelArray, camera, renderer.domElement);

    /* lights */
    const ambientLight = new THREE.AmbientLight(0xffffff);
    scene.add(ambientLight);

    window.addEventListener('resize', onWindowResize);

    sceneReady = true;
    exitRoom = true;
}

function loadAssets() {
    /* load models */
    const loader = new GLTFLoader(manager);
    for (let i = 0; i < currentGroup.length; i++) {

        const obj = currentGroup[i];

        loader.load(obj.src, function (glb) {
            object = glb.scene;

            /* set random rotation */
            object.rotation.y = Math.random() * 4 * Math.PI;

            scene.add(object)
            modelArray.push(object);
        })
    }
}

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);

    render();
}

function animate() {
    requestAnimationFrame(animate);
    render();
}

function render() {
    renderer.render(scene, camera);
}

window.onload = function() {
    sceneSetup();
    loadAssets();
    setTimeout(animate, 1000);
    setTimeout(function() {
        loading.classList.add('fade');
    }, 1000);
}
</code>
</pre>

<p class="indent">Once all of the models had been added into the scene and the drag controls were working properly, being able to move all of the models in the scene by dragging them, I then decided that I wanted much more camera mobility in the scene and so I combine the DragControls with <a href="https://threejs.org/examples/?q=orbit#misc_controls_orbit">OrbitControls.js</a> <sup><i class="fa-solid fa-arrow-up-right-from-square icon-grey"></i></sup>, orbit controls enable to you pan, spin and zoom in and out with the camera around the scene which meant that when building your vessel you would be able to see your vessel creations from all different angles:</p>

<pre>
<code>
/* vessels.min.js */


/* added OrbitControls import */
import {OrbitControls} from 'three/OrbitControls.js';

let orbitControls;

function sceneSetup() {

    /* controls */
    /* orbit */
    orbitControls = new OrbitControls(camera, renderer.domElement);
    orbitControls.update();
    orbitControls.addEventListener('change', render)
    orbitControls.maxDistance = 15;
    orbitControls.enablePan = true;
    orbitControls.panSpeed = 0.5;

    /* drag */
    dragControls = new DragControls(modelArray, camera, renderer.domElement);

    /* added eventListener handlers which enabled the two controls to co-exist, */
    /* when you use the drag controls, orbit controls are disabled, then when */
    /* you stop using drag controls, orbit controls get re-enabled */

    dragControls.addEventListener('dragstart', function() {
        orbitControls.enabled = false;
    });
    dragControls.addEventListener('dragend', function() {
        orbitControls.enabled = true;
    });

}
</code>
</pre>

<p class="indent">Then, because there is almost 100 different spliced models which get loaded into the scene I thought I would be a good to load in a much smaller group of vessel parts which are then used to build the model. So what I came up with is, I took the currentGroup model array which contained all of the models, shuffle the array, then take the first 15 models from that shuffled array, we then shuffle those 15 models again so their order is fully randomized. The chosen 15 models then get loaded into the scene and pushed to the modelArray:</p>

<pre>
<code>
/* vessels.min.js */


let numObjects;

function loadAssets() {
    /* shuffle the array containing all of the models */
    for (let i = currentGroup.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [currentGroup[i], currentGroup[j]] = [currentGroup[j], currentGroup[i]];
    }

    /* pick the first 15 models from that array */
    currentGroup = currentGroup.slice(0, 15);
    numObjects = currentGroup.length;


    /* shuffle the picked 15 models so their order and position is fully randomized */
    for (let i = numObjects - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [currentGroup[i], currentGroup[j]] = [currentGroup[j], currentGroup[i]];
    }

    /* load models */
    const loader = new GLTFLoader(manager);
    for (let i = 0; i < numObjects; i++) {

        const obj = currentGroup[i];

        loader.load(obj.src, function (glb) {
            object = glb.scene;

            /* Set random rotation */
            object.rotation.y = Math.random() * 4 * Math.PI;

            scene.add(object)
            modelArray.push(object);
        })
    }
}
</code>
</pre>

<p class="indent">With all of this shuffling and randomization of which models get loaded, I was curious how many permutations this application would have. Including the random rotation on the y-axis, the total number of Build-A-Vessel permutations is approximatley: 6.08173 x 10^42 or 608,173,145,511,212,917,289,174,621,788,928. If we do not include the random y-axis rotation randomness the number is closer to: 2,854,889,312.</p>

<p>After limiting the application to only showing 15 random models, I now wanted to make it so that the models would be displayed in an even grid which is responsive to screen size and orientation. This is so that the website application can then be used and experienced on mobile as well as desktop. To do when loading in the models I set the x and z positions of the models to align to a grid. On dekstop/landscape monitors I set the grid rows to 5 and columns to 3, then the application detects whether the window.innerWidth is less than or equal to 800px, and if it is the application adjusts the grid rows to be 3 and the columns to 5, which transforms the grid from lanscape to portrait, to finish I also ajust the camera's position to fit the portrait grid:</p>

<pre>
<code>
/* vessels.min.js */


let numRows, numCols;

function sceneSetup() {

    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 2000);
    /* adjust camera position on mobile */
    if (window.innerWidth <= 800) {
        camera.position.z = 12;
    } else {
        camera.position.z = 10;
    }
}

function loadAssets() {

    /* define spacing between models */
    let spacing = 3;

    for (let i = currentGroup.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [currentGroup[i], currentGroup[j]] = [currentGroup[j], currentGroup[i]];
    }

    currentGroup = currentGroup.slice(0, 15);
    numObjects = currentGroup.length;

    /* adjust grid parameters for mobile screens */
    if (window.innerWidth < 800) {
        numRows = 5;
        numCols = 3;
    } else {
        numRows = 3;
        numCols = 5;
    }

    /* shuffle array */
    for (let i = numObjects - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [currentGroup[i], currentGroup[j]] = [currentGroup[j], currentGroup[i]];
    }

    /* load models */
    const loader = new GLTFLoader(manager);
    for (let i = 0; i < numObjects; i++) {

        const obj = currentGroup[i];

        loader.load(obj.src, function (glb) {
            object = glb.scene;

            /* set grid pattern */
            const row = Math.floor(i / numCols);
            const col = i % numCols;

            /* set position based on grid index */
            const x = (col - (numCols - 1) / 2) * spacing;
            const y = (row - (numRows - 1) / 2) * spacing;

            /* adjust the y position if on mobile */
            if (window.innerWidth <= 800) {
                object.position.set(x, y + 1, 0);
            } else {
                object.position.set(x, y, 0);
            }

            /* set random rotation */
            object.rotation.y = Math.random() * 4 * Math.PI;

            scene.add(object)
            modelArray.push(object);
        })
    }
}
</code>
</pre>

<p class="indent">Now that the models are loaded into the scene and are able to be seen on desktop and mobile. I now wanted a way for users to save their creations. To do this I used <a href="https://threejs.org/examples/?q=exporter#misc_exporter_gltf">GLTFExporter.js</a> <sup><i class="fa-solid fa-arrow-up-right-from-square icon-grey"></i></sup>:</p>

<pre>
<code>
/* build-a-vessel.njk */


&lt;div id=&quot;buttons&quot;&gt;
    &lt;p&gt;
        
        &lt;button id=&quot;download-glb&quot; title=&quot;Save Vessel&quot;&gt;&lt;i class=&quot;fa-solid fa-cloud-arrow-down&quot;&gt;&lt;/i&gt;&lt;/button&gt;
    &lt;/p&gt;
&lt;/div&gt;
</code>
</pre>

<pre>
<code>
/* vessels.min.js */


/* import GLTFExporter */
import {GLTFExporter} from 'three/GLTFExporter.js';

/* get the HTML download button */
const btn = document.getElementById('download-glb');

function sceneSetup() {
    
    /* buttons */
    /* download vessel */
    btn.addEventListener('click', downloadVessel);
}

/* gltf exporter */
function downloadVessel() {
    const exporter = new GLTFExporter();
    const options = {
        onlyVisible: true,
        binary: true
    };
    exporter.parse(
        scene,
        function(result) {
            saveArrayBuffer(result, `vessel.glb`)
        },
        function (error) {
            console.log('An error happened during parsing', error);
        },
        options
    )
}

const link = document.createElement('a');
link.style.display = 'none';
document.body.appendChild(link);

function save(blob, fileName) {
    link.href = URL.createObjectURL(blob);
    link.download = fileName;
    link.click();
}

function saveArrayBuffer(buffer, fileName) {
    save(new Blob([buffer], {type: 'application/octet-stream'}), fileName);
}
</code>
</pre>

<p class="indent">And finally to finish the application we add some quality of life changes, like a shuffle button which reloads the application with a new set of models and also a reset camera button to reset the orbit controls camera to its original position:</p>

<pre>
<code>
/* build-a-vessel.njk */


&lt;div id=&quot;buttons&quot;&gt;
    &lt;p&gt;
        &lt;button id=&quot;shuffle&quot; title=&quot;Shuffle&quot;&gt;&lt;i class=&quot;fa-solid fa-shuffle&quot;&gt;&lt;/i&gt;&lt;/button&gt;
        &lt;button id=&quot;reset&quot; title=&quot;Reset Camera&quot;&gt;&lt;i class=&quot;fa-solid fa-camera-rotate&quot;&gt;&lt;/i&gt;&lt;/button&gt;
        &lt;button id=&quot;download-glb&quot; title=&quot;Save Vessel&quot;&gt;&lt;i class=&quot;fa-solid fa-cloud-arrow-down&quot;&gt;&lt;/i&gt;&lt;/button&gt;
    &lt;/p&gt;
&lt;/div&gt;
</code>
</pre>

<pre>
<code>
/* vessels.min.js */


const uuidArray = [];

/* get reset and shuffle button */
const resetCameraButton = document.getElementById('reset');
const shuffleButton = document.getElementById('shuffle');

function sceneSetup() {
    
    /* buttons */
    /* add event listeners to reset button */
    document.body.addEventListener('keydown', function(event) {
        if (event.which == 82) { // R
            resetCamera();
        }
    }, false);
    resetCameraButton.addEventListener('click', resetCamera, false);

    /* add functionality to shuffle button */
    shuffleButton.onclick = function() {
        loading.classList.remove('fade');
        setTimeout(function () {
            window.location.href = `?id=${uuidArray[0]}`;
        }, 1200)
    }
}

function generateUUID() {
    const uuid = Math.floor(Math.random() * 100000);
    uuidArray.push(uuid);
    return uuid;
}

function resetCamera() {
    orbitControls.reset();
}
</code>
</pre>

<p>Future updates for Build-A-Vessel:</p>
<p>- Add model grouping - I would like to add functionality which is in the DragControls example which allows you to select multiple objects and add them to a group which means that when you drag them they move together as a group. I think this would improve the usabilty of the application and make it easier to position in-progress or finished vessels.</p>
<p>- Window screenshots - For users who are on mobile or are not able to view the downloaded .glb vessel models, I would like to add a button which takes a screenshot image of the current camera view and saves it. This is so that all users will have a record of their Build-A-Vessel creations regardless of which device they are on!</p>

<br>

<p>Future plans for Build-A-Vessel:</p>
<p>- Exhibiting - I would like to exhibit Build-A-Vessel in some capacity, I would like to develop a way to put the application onto touch screen monitors powered by something like a Raspberry Pi so that the monitors can be portable or included in some kind of multi-media installation.</p>
<p>- Saving models when installed in an exhibition - I would also like to develop some way for users who do use the Build-A-Vessel application at an exhibition to save their models in a way were they get to keep them, using the online application and saving models is very easy as you have your own device. But at an exhibition the application will be on a private device, so I would like to find a way to either save the models to a server which then get uploaded to an archive that can be accessed and downloaded by the public, or for the finished vessels to be sent via email. Or the models can be saved onto a USB with a custom 3D modelled Vessel casing.</p>

<br>

<p><i class="fa-solid fa-star-of-life icon-accent"></i> Try out <a href="/works/build-a-vessel">Build-A-Vessel</a></p>

<p><i class="fa-solid fa-star-of-life icon-accent"></i> Got some feedback? <a href="/contact">Contact</a></p>

<br>

<hr>

<br>

<script type="text/javascript">
    function showElement() {
        let hiddenElements = document.querySelectorAll("#hidden-element");

        for (let i = 0; i < hiddenElements.length; i++) {
            if (hiddenElements[i].style.display === "none") {
                hiddenElements[i].style.display = "block";
            } else {
                hiddenElements[i].style.display = "none";
            }
        }
    }
</script>
<button onclick="showElement()" style="width: 100px; height: 25px; cursor: pointer;">Full Code</button>

<pre id="hidden-element" style="display: none;">
<code>
/* build-a-vessel.njk */


&lt;section id=&quot;loading&quot;&gt;
    &lt;div id=&quot;loader&quot;&gt;&lt;/div&gt;
&lt;/section&gt;

&lt;div id=&quot;buttons&quot;&gt;
    &lt;p&gt;
        &lt;button id=&quot;shuffle&quot; title=&quot;Shuffle&quot;&gt;&lt;i class=&quot;fa-solid fa-shuffle&quot;&gt;&lt;/i&gt;&lt;/button&gt;
        &lt;button id=&quot;reset&quot; title=&quot;Reset Camera&quot;&gt;&lt;i class=&quot;fa-solid fa-camera-rotate&quot;&gt;&lt;/i&gt;&lt;/button&gt;
        &lt;button id=&quot;download-glb&quot; title=&quot;Save Vessel&quot;&gt;&lt;i class=&quot;fa-solid fa-cloud-arrow-down&quot;&gt;&lt;/i&gt;&lt;/button&gt;
    &lt;/p&gt;
&lt;/div&gt;

&lt;script
    async=&quot;async&quot;
    src=&quot;https://unpkg.com/es-module-shims@1.3.6/dist/es-module-shims.js&quot;&gt;&lt;/script&gt;
&lt;script type=&quot;importmap&quot;&gt;
    {
        &quot;imports&quot;: {
            &quot;three&quot;: &quot;/js/three/three.module.min.js&quot;,
            &quot;three/&quot;: &quot;/js/three/&quot;
        }
    }
&lt;/script&gt;
&lt;script type=&quot;module&quot; src=&quot;/js/vessels.min.js&quot;&gt;&lt;/script&gt;
</code>
</pre>

<pre id="hidden-element" style="display: none;">
<code>
/* vessels.min.js */


import * as THREE from 'three';
import {GLTFLoader} from 'three/GLTFLoader.js';
import {GLTFExporter} from 'three/GLTFExporter.js';
import {DragControls} from 'three/DragControls.js';
import {OrbitControls} from 'three/OrbitControls.js';

import {vesselAssets} from '../js/_config.min.js';

let scene, camera, renderer, dragControls, orbitControls;
let object, numObjects, numRows, numCols;
const manager = new THREE.LoadingManager();
let modelArray = []; const uuidArray = [];

let sceneReady = false, exitRoom = false;

const urlParams = new URLSearchParams(window.location.search);
let groupNumb = parseInt(urlParams.get('id')) > vesselAssets.length ? '0' : 
                parseInt(urlParams.get('id')) <= vesselAssets.length ? parseInt(urlParams.get('id')) : 
                0;
const groupID = window.location.href.split('=').pop();
let currentGroup = vesselAssets[groupNumb];

const btn = document.getElementById('download-glb');
const loading = document.getElementById('loading');
const resetCameraButton = document.getElementById('reset');
const shuffleButton = document.getElementById('shuffle');

function sceneSetup() {
    /* scene */
    scene = new THREE.Scene();
    scene.background = new THREE.Color(0x000000);
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 2000);
    if (window.innerWidth <= 800) {
        camera.position.z = 12;
    } else {
        camera.position.z = 10;
    }

    /* renderer */
    renderer = new THREE.WebGLRenderer({
        alpha: true,
        antialias: true 
    });
    renderer.compile(scene, camera);
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);

    /* orbit controls */
    orbitControls = new OrbitControls(camera, renderer.domElement);
    orbitControls.update();
    orbitControls.addEventListener('change', render)
    orbitControls.maxDistance = 15;
    orbitControls.enablePan = true;
    orbitControls.panSpeed = 0.5;

    /* drag controls */
    dragControls = new DragControls(modelArray, camera, renderer.domElement);
    dragControls.addEventListener('dragstart', function() {
        orbitControls.enabled = false;
    });
    dragControls.addEventListener('dragend', function() {
        orbitControls.enabled = true;
    });

    /* lights */
    const ambientLight = new THREE.AmbientLight(0xffffff);
    scene.add(ambientLight);

    window.addEventListener('resize', onWindowResize);

    /* buttons */
    /* download vessel */
    btn.addEventListener('click', downloadVessel);

    /* reset camera */
    document.body.addEventListener('keydown', function(event) {
        if (event.which == 82) { // R
            resetCamera();
        }
    }, false);
    resetCameraButton.addEventListener('click', resetCamera, false);

    generateUUID();

    shuffleButton.onclick = function() {
        loading.classList.remove('fade');
        setTimeout(function () {
            window.location.href = `?id=${uuidArray[0]}`;
        }, 1200)
    }

    sceneReady = true;
    exitRoom = true;
}

function generateUUID() {
    const uuid = Math.floor(Math.random() * 100000);
    uuidArray.push(uuid);
    return uuid;
}

function loadAssets() {

    /* model spacing */
    let spacing = 3;

    for (let i = currentGroup.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [currentGroup[i], currentGroup[j]] = [currentGroup[j], currentGroup[i]];
    }

    currentGroup = currentGroup.slice(0, 15);
    numObjects = currentGroup.length;

    if (window.innerWidth < 800) { // adjust grid parameters for mobile screens
        numRows = 5;
        numCols = 3;
    } else {
        numRows = 3;
        numCols = 5;
    }

    /* shuffle array */
    for (let i = numObjects - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [currentGroup[i], currentGroup[j]] = [currentGroup[j], currentGroup[i]];
    }

    /* load models */
    const loader = new GLTFLoader(manager);
    for (let i = 0; i < numObjects; i++) {

        const obj = currentGroup[i];

        loader.load(obj.src, function (glb) {
            object = glb.scene;
            const row = Math.floor(i / numCols);
            const col = i % numCols;

            /* set model grid position */
            const x = (col - (numCols - 1) / 2) * spacing;
            const y = (row - (numRows - 1) / 2) * spacing;

            if (window.innerWidth <= 800) {
                object.position.set(x, y + 1, 0);
            } else {
                object.position.set(x, y, 0);
            }

            /* set random rotation */
            object.rotation.y = Math.random() * 4 * Math.PI;

            scene.add(object)
            modelArray.push(object);
        })
    }
}

function downloadVessel() {
    const exporter = new GLTFExporter();
    const options = {
        onlyVisible: true,
        binary: true
    };
    exporter.parse(
        scene,
        function(result) {
            saveArrayBuffer(result, `vessel-${groupID}.glb`)
        },
        function (error) {
            console.log('An error happened during parsing', error);
        },
        options
    )
}

const link = document.createElement('a');
link.style.display = 'none';
document.body.appendChild(link);

function save(blob, fileName) {
    link.href = URL.createObjectURL(blob);
    link.download = fileName;
    link.click();
}

function saveArrayBuffer(buffer, fileName) {
    save(new Blob([buffer], {type: 'application/octet-stream'}), fileName);
}

function resetCamera() {
    orbitControls.reset();
}

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);

    render();
}

function animate() {
    requestAnimationFrame(animate);
    render();
}

function render() {
    renderer.render(scene, camera);
}

window.onload = function() {
    sceneSetup();
    loadAssets();
    setTimeout(animate, 1000);
    setTimeout(function() {
        loading.classList.add('fade');
    }, 1000);

    console.log(`Build-A-Vessel-${groupID} Ready`);
}
</code>
</pre>