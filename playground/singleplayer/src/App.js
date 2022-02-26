// import logo from './logo.svg';
import './App.css';
import * as THREE from 'three';
import { PointerLockControls } from 'three/examples/jsm/controls/PointerLockControls';
import React, { useEffect, useRef } from 'react';

function App() {
  const blockerRef = useRef(null);
  const instructionsRef = useRef(null);
  let fwd = false; let rev = false; let left = false; let right = false;
  let zDir; let xDir; let vX; let vZ;

  let t = performance.now();

  // Instantiate all important THREE objects
  const camera = new THREE.PerspectiveCamera(80, window.innerWidth / window.innerHeight, 1, 1000);
  const scene = new THREE.Scene();
  const renderer = new THREE.WebGLRenderer();
  const controls = new PointerLockControls(camera, document.body);
  const ambientLight = new THREE.AmbientLight(0x6688cc);
  const directionalLight = new THREE.DirectionalLight(0xffffaa, 1.2);

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
  // Add hooks for cursor lock
  useEffect(() => {
    instructionsRef.current.addEventListener('click', () => { controls.lock(); });
  }, [controls]);
  useEffect(() => {
    controls.addEventListener('lock', () => {
      instructionsRef.current.style.display = 'none';
      blockerRef.current.style.display = 'none';
    });
  }, [controls]);
  useEffect(() => {
    controls.addEventListener('unlock', () => {
      blockerRef.current.style.display = 'block';
      instructionsRef.current.style.display = 'flex';
    });
  }, [controls]);

  // Define accessory functions to handle window rerendering, movement, etc.
  const onWindowResize = () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  };

  const onKeyDown = (event) => {
    switch (event.key) {
      case 'w':
        fwd = true;
        break;
      case 'a':
        left = true;
        break;
      case 's':
        rev = true;
        break;
      case 'd':
        right = true;
        break;
      default:
        break;
    }
  };

  const onKeyUp = (event) => {
    switch (event.key) {
      case 'w':
        fwd = false;
        break;
      case 'a':
        left = false;
        break;
      case 's':
        rev = false;
        break;
      case 'd':
        right = false;
        break;
      default:
        break;
    }
  };

  // Movement: at each time step, move the camera by an amount
  // determined by a velocity variable dependent on the direction,
  // which is based on the keys pressed by the user
  const moveT = (t1) => {
    if (controls.isLocked === true) {
      const delta = (t1 - t) / 1000;
      zDir = Number(fwd) - Number(rev);
      xDir = Number(right) - Number(left);
      vZ = 0;
      vX = 0;
      if (fwd || rev) {
        vZ = zDir * 400 * delta;
      }
      if (right || left) {
        vX = xDir * 400 * delta;
      }
      controls.moveRight(vX * delta);
      controls.moveForward(vZ * delta);
      // playerballmesh.position.set(camera.position.x + 10, camera.position.y, camera.position.z + 10);
      console.log(playerballmesh.position);
    }
  };

  // const httpServer = createServer();
  // const io = new Server(httpServer);
  // io.on('connection', () => {});
  // httpServer.listen(3001);

  // Animation: Set the rotation of the cube, and call the movement and renderer functions
  const render = () => {
    requestAnimationFrame(render);
    // knot.rotation.x += 0.01;
    // knot.rotation.y += 0.01;
    const t1 = performance.now();
    moveT(t1);
    t = t1;
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
  document.addEventListener('keydown', onKeyDown);
  document.addEventListener('keyup', onKeyUp);
  document.body.appendChild(renderer.domElement);

  // Render the scene
  render();

  return (
    <div
      style={{
        position: 'absolute',
        width: '100%',
        height: '100%',
        backgroundColor: 'rgba(0,0,0,0.5)',
      }}
      ref={blockerRef}
    >
      <div
        style={{
          width: '100%',
          height: '100%',

          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',

          textAlign: 'center',
          fontSize: '36px',
          cursor: 'pointer',
        }}
        ref={instructionsRef}
      >
        <p>
          Click to play
        </p>
        <p>
          Move: WASD
          <br />
          Look: MOUSE
        </p>
      </div>
    </div>
  );
}

export default App;
//
