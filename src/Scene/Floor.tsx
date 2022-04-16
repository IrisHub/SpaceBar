import { usePlane } from '@react-three/cannon';
import React from 'react';

type FloorProps = {
  length: number;
  width: number;
};

export default function Floor(props: FloorProps) {
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
      <planeBufferGeometry
        attach="geometry"
        args={[props.length, props.width]}
      />
      <meshBasicMaterial
        attach="material"
        color="#000000"
        transparent="true"
        opacity={0.25}
      />
    </mesh>
  );
}
