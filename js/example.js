

const animations = gltf.animations;

mixer = new THREE.AnimationMixer( model );

idleAction = mixer.clipAction( animations[ 0 ] );
walkAction = mixer.clipAction( animations[ 3 ] );
runAction = mixer.clipAction( animations[ 1 ] );

actions = [ idleAction, walkAction, runAction ];

activateAllActions();

animate();