// import logo from './logo.svg';
import "./App.css";
import * as THREE from "three";
import { PointerLockControls } from "three/examples/jsm/controls/PointerLockControls";
import React, { useEffect, useRef } from "react";

function App() {
  const blockerRef = useRef(null);
  const instructionsRef = useRef(null);
  let fwd = false;
  let rev = false;
  let left = false;
  let right = false;
  let jump = false;
  let canJump = false;

  const objects = [];

  let zDir;
  let xDir;
  let vX;
  let vZ;
  let vY;

  let t = performance.now();

  // Instantiate all important THREE objects
  const camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    1,
    1000
  );
  const scene = new THREE.Scene();
  const renderer = new THREE.WebGLRenderer();
  const controls = new PointerLockControls(camera, document.body);
  const light = new THREE.HemisphereLight(0xffffff, 0x778888, 1);

  let origin = new THREE.Vector3();
  let direction = new THREE.Vector3(0, -1, 0); //Y pointing down negative
  let near = 0;
  let far = 10;
  let raycaster = new THREE.Raycaster(origin, direction, near, far);

  // Set props for THREE objects
  camera.position.z = 0;
  camera.position.y = 10;
  scene.background = new THREE.Color(0xffffff);
  scene.fog = new THREE.Fog(0xffffff, 0, 500);
  light.position.set(0, 12, -2);
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(window.innerWidth, window.innerHeight);

  // Define THREE objects for the scene
  // Add a floor
  const planegeometry = new THREE.PlaneBufferGeometry(800, 800, 10, 10);
  planegeometry.rotateX(-Math.PI / 2);
  const planematerial = new THREE.MeshBasicMaterial({});
  const planemesh = new THREE.Mesh(planegeometry, planematerial);
  planemesh.material.color.setHex(0xb556f1);

  // Add a sphere so there's a reference point for walking around
  const geometry = new THREE.BoxGeometry(2, 2, 2);
  const material = new THREE.MeshStandardMaterial({
    color: 0xffffff,
    wireframe: false,
  });
  const cube = new THREE.Mesh(geometry, material);
  cube.position.z = -4;
  cube.position.y = 10;
  cube.position.x = 1;

  const boxGeometry = new THREE.BoxGeometry(10, 10, 10).toNonIndexed();

  const boxMaterial = new THREE.MeshPhongMaterial({
    specular: 0xffffff,
    flatShading: true,
    vertexColors: true,
  });
  boxMaterial.color.setHSL(
    Math.random() * 0.2 + 0.5,
    0.75,
    Math.random() * 0.25 + 0.75
  );

  const box = new THREE.Mesh(boxGeometry, boxMaterial);
  box.position.x = 10;
  // box.position.y = Math.floor(Math.random() * 20) * 20 + 10;
  box.position.y = 10;
  box.position.z = Math.floor(Math.random() * 20 - 10) * 20;
  objects.push(box);

  // Add hooks for cursor lock
  useEffect(() => {
    instructionsRef.current.addEventListener("click", () => {
      controls.lock();
    });
  }, [controls]);
  useEffect(() => {
    controls.addEventListener("lock", () => {
      instructionsRef.current.style.display = "none";
      blockerRef.current.style.display = "none";
    });
  }, [controls]);
  useEffect(() => {
    controls.addEventListener("unlock", () => {
      blockerRef.current.style.display = "block";
      instructionsRef.current.style.display = "flex";
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
      case "w":
        fwd = true;
        break;
      case "a":
        left = true;
        break;
      case "s":
        rev = true;
        break;
      case "d":
        right = true;
        break;
      case " ": //SpaceBar
        console.log("I fired");
        if (canJump === true) {
          console.log("true");

          jump = true;
          canJump = false;
        }
        break;
      default:
        break;
    }
  };

  const onKeyUp = (event) => {
    switch (event.key) {
      case "w":
        fwd = false;
        break;
      case "a":
        left = false;
        break;
      case "s":
        rev = false;
        break;
      case "d":
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
      //Update position of ray in raycaster
      raycaster.ray.origin.copy(controls.getObject().position);
      raycaster.ray.origin.y -= 10;

      const intersections = raycaster.intersectObjects(objects, false);
      const onObject = intersections.length > 0;

      const delta = (t1 - t) / 1000;
      zDir = Number(fwd) - Number(rev);
      xDir = Number(right) - Number(left);
      vZ = 0;
      vX = 0;
      vY = 0;

      if (fwd || rev) {
        vZ = zDir * 400 * delta;
      }
      if (right || left) {
        vX = xDir * 400 * delta;
      }

      if (jump) {
        vY += 550;
        jump = false;
      }

      vY -= 9.8 * 100.0 * delta; // 100.0 = mass

      if (onObject === true) {
        console.log("on object true");
        vY = Math.max(0, vY);
        canJump = true;
      }

      controls.moveRight(vX * delta);
      controls.moveForward(vZ * delta);
      controls.getObject().position.y += vY * delta; // new behavior

      if (controls.getObject().position.y < 10) {
        //Don't fall through floor...
        vY = 0;
        controls.getObject().position.y = 10;
        canJump = true;
      }
    }
  };

  // Animation: Set the rotation of the cube, and call the movement and renderer functions
  const render = () => {
    requestAnimationFrame(render);
    cube.rotation.x += 0.01;
    cube.rotation.y += 0.01;
    const t1 = performance.now();
    moveT(t1);
    t = t1;
    renderer.render(scene, camera);
  };

  // Add all THREE elements to the scene
  scene.add(controls.getObject());
  scene.add(light);
  scene.add(planemesh);
  scene.add(cube);
  scene.add(box);

  // Add listeners
  window.addEventListener("resize", onWindowResize);
  document.addEventListener("keydown", onKeyDown);
  document.addEventListener("keyup", onKeyUp);
  document.body.appendChild(renderer.domElement);

  // Render the scene
  render();

  return (
    <div
      style={{
        position: "absolute",
        width: "100%",
        height: "100%",
        backgroundColor: "rgba(0,0,0,0.5)",
      }}
      ref={blockerRef}
    >
      <div
        style={{
          width: "100%",
          height: "100%",

          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",

          textAlign: "center",
          fontSize: "36px",
          cursor: "pointer",
        }}
        ref={instructionsRef}
      >
        <p>Click to play</p>
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
