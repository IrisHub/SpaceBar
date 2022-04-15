import { usePlane } from '@react-three/cannon';
import React from 'react';

export default function Floor() {
  /**
   * Defines a basic floor component as a flat plane rotated 90 degrees
   * This floor is partially transparent and will come with gridlines to
   * calibrate movement.
   */
  const [ref] = usePlane(() => ({
    rotation: [-Math.PI / 2, 0, 0],
  }));
  return (
    <mesh ref={ref} rotation={[-Math.PI / 2, 0, 0]}>
      <planeBufferGeometry attach="geometry" args={[100, 100]} />
      <meshBasicMaterial
        attach="material"
        color="#000000"
        transparent="true"
        opacity={0.25}
      />
    </mesh>
  );
}
