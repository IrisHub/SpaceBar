import { useFrame } from '@react-three/fiber';
import React, { useRef } from 'react';
import { Object3D } from 'three';

const dummy = new Object3D();

/**
 * This file serves several purposes. It renders an animated
 * object into the scene to a) calibrate walking speed/jumping height
 * b) Benchmark performance issues
 * Base taken from https://codesandbox.io/s/4rubo?file=/src/App.js
 */
const SceneObject = () => {
  const meshRef = useRef<{
    rotation: { x: number; y: number };
    instanceMatrix: any;
    setMatrixAt: any;
  }>();

  useFrame(({ clock }) => {
    const time = clock.getElapsedTime();
    if (!meshRef.current) {
      return;
    }
    if (meshRef.current) {
      meshRef.current.rotation.x = Math.sin(time / 4);
      meshRef.current.rotation.y = Math.sin(time / 2);
    }
    let i = 0;
    const amount = 10;
    const offset = (amount - 1) / 2;

    for (let x = 0; x < amount; x++) {
      for (let y = 0; y < amount; y++) {
        for (let z = 0; z < amount; z++) {
          dummy.position.set(offset - x, offset - y, offset - z);
          dummy.rotation.y =
            Math.sin(x / 2 + time) +
            Math.sin(y / 3 + time) +
            Math.sin(z / 4 + time);
          dummy.rotation.z = dummy.rotation.y * 2;

          dummy.updateMatrix();

          meshRef.current.setMatrixAt(i++, dummy.matrix);
        }
        meshRef.current.instanceMatrix.needsUpdate = true;
      }
    }
  });

  return (
    <instancedMesh ref={meshRef} args={[null, null, 1]} position={[0, 5, 0]}>
      <boxGeometry args={[10, 10, 10, 32]}></boxGeometry>
      <meshPhongMaterial color="lightgreen" />
    </instancedMesh>
  );
};

export default SceneObject;
