import * as THREE from 'three';
import { PointerLockControls } from 'three/examples/jsm/controls/PointerLockControls';
import React, { useEffect, useRef } from 'react';
import Instructions from './Instructions'
import { Controller } from './controls';

export default function Scene(props: any) {
    let fwd = false; let rev = false; let left = false; let right = false;
    let zDir; let xDir; let vX; let vZ;
    let time;
  
    // Instantiate all important THREE objects
    const camera = new THREE.PerspectiveCamera(80, window.innerWidth / window.innerHeight, 1, 1000);
    const scene = new THREE.Scene();
    const renderer = new THREE.WebGLRenderer();
    const controls = new PointerLockControls(camera, document.body);
    const ambientLight = new THREE.AmbientLight(0x6688cc);
    const directionalLight = new THREE.DirectionalLight(0xffffaa, 1.2);
  
    const controller = new Controller( controls );
    
    // Set props for THREE objects
    camera.position.z = 0;
    camera.position.y = 10;
    scene.background = new THREE.Color(0x88ccff);
    scene.fog = new THREE.Fog(0xffffff, 0, 500);
    directionalLight.position.set(-5, 10, -1);
    directionalLight.castShadow = true;
    directionalLight.shadow.camera.near = 0.01;
    directionalLight.shadow.camera.right = 30;
    directionalLight.shadow.camera.far = 500;
    directionalLight.shadow.camera.left = -30;
    directionalLight.shadow.camera.top = 30;
    directionalLight.shadow.camera.bottom = -30;
    directionalLight.shadow.mapSize.width = 1024;
    directionalLight.shadow.mapSize.height = 1024;
    directionalLight.shadow.radius = 4;
    directionalLight.shadow.bias = -0.00006;
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.VSMShadowMap;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.0;
  
    // Add a sphere so there's a reference point for walking around
    // const geometry = new THREE.BoxGeometry(2, 2, 2);
    // const material = new THREE.MeshStandardMaterial({
    //   color: 0xFFFFFF, wireframe: false, metalness: 0.1,
    // });
    // const cube = new THREE.Mesh(geometry, material);
    // cube.position.z = -4;
    // cube.position.y = 10;
    // cube.position.x = 1;
    const knotgeometry = new THREE.TorusKnotGeometry(10, 3, 64, 8, 2, 3);
    const knotmaterial = new THREE.MeshLambertMaterial({
      color: 0xffffff, metalness: 0.0,
    });
    const knot = new THREE.Mesh(knotgeometry, knotmaterial);
    knot.castShadow = true;
    knot.position.z = -45;
    knot.position.y = 10;
    knot.position.x = -6;
  
    // Define THREE objects for the scene
    // Add a floor
    const planegeometry = new THREE.PlaneBufferGeometry(800, 800, 10, 10);
    planegeometry.rotateX(-Math.PI / 2);
    const planematerial = new THREE.MeshStandardMaterial();
    const planemesh = new THREE.Mesh(planegeometry, planematerial);
    planemesh.material.color.setHex(0xFFEEAA);
    planemesh.receiveShadow = true;
    planemesh.castShadow = true;
  
    const playerballgeometry = new THREE.SphereGeometry(3);
    const playerballmaterial = new THREE.MeshBasicMaterial({ color: 0xFFFFFF });
    const playerballmesh = new THREE.Mesh(playerballgeometry, playerballmaterial);
    // playerballmesh.material.color.setHex(0x000000);
    playerballmesh.receiveShadow = true;
    playerballmesh.castShadow = true;
    camera.add(playerballmesh);
    playerballmesh.position.set(0, 0, 0);

    // Define accessory functions to handle window rerendering, movement, etc.
    const onWindowResize = () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
    };
    // Movement: at each time step, move the camera by an amount
    // determined by a velocity variable dependent on the direction,
    // which is based on the keys pressed by the user

    // const httpServer = createServer();
    // const io = new Server(httpServer);
    // io.on('connection', () => {});
    // httpServer.listen(3001);

    // Animation: Set the rotation of the cube, and call the movement and renderer functions
    const render = () => {
    requestAnimationFrame(render);
        // knot.rotation.x += 0.01;
        // knot.rotation.y += 0.01;
        controller.move(performance.now(), 400);
        renderer.render(scene, camera);
    };

    // Add all THREE elements to the scene
    scene.add(controls.getObject());
    scene.add(ambientLight);
    scene.add(directionalLight);
    scene.add(planemesh);
    // scene.add(cube);
    scene.add(knot);

    // Add listeners
    window.addEventListener('resize', onWindowResize);
    document.addEventListener('keydown', controller.onKeyDown);
    document.addEventListener('keyup', controller.onKeyUp);
    document.body.appendChild(renderer.domElement);

    // Render the scene
    render();
    return (
        <Instructions controls={ controls }/>
    )
}