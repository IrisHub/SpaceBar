import { usePlane } from '@react-three/cannon';
import React from 'react';

export default function Floor() {
  const [ref] = usePlane(() => ({
    rotation: [-Math.PI / 2, 0, 0],
  }));
  return (
    <mesh ref={ref} rotation={[-Math.PI / 2, 0, 0]}>
      <planeBufferGeometry attach="geometry" args={[100, 100]}/>
      <meshLambertMaterial attach="material" color="lightgreen"/>
    </mesh>
  );
}