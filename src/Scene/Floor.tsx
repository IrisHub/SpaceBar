import React from 'react';
import { usePlane } from '@react-three/cannon';
import Boundaries from './Boundaries';
import { PlaneProps } from '../allTypes';

/**
 * Defines a basic floor component as a flat plane rotated 90 degrees
 * If boundary prop is passed, renders plane with collidable boundaries on each side of the plane.
 * This floor is partially transparent and will come with gridlines to
 * calibrate movement.
 */
export default function Floor(props: PlaneProps) {
  const [ref] = usePlane(() => ({
    rotation: [-Math.PI / 2, 0, 0],
  }));

  return (
    <>
      {props.boundary && (
        <>
          <Boundaries
            lengthX={props.lengthX}
            widthZ={props.widthZ}
            debug={props.debug}
          />
        </>
      )}
      <mesh ref={ref} rotation={[-Math.PI / 2, 0, 0]}>
        <planeBufferGeometry
          attach="geometry"
          args={[props.lengthX * 2, props.widthZ * 2]}
        />
        <meshBasicMaterial
          attach="material"
          color="#000000"
          transparent="true"
          opacity={0.25}
        />
      </mesh>

      <gridHelper
        args={[props.lengthX * 2, props.widthZ * 2, 'black', 'grey']}
      />
    </>
  );
}
