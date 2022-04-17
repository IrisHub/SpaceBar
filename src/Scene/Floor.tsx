import { usePlane } from '@react-three/cannon';
import React from 'react';
import Box from '../Shapes/Box';

type FloorProps = {
  length: number;
  width: number;
  boundary?: boolean;
  debug?: boolean;
};

function Boundaries(props: FloorProps) {
  let boundaryColor;

  if (props.debug) {
    boundaryColor = {
      color: 'yellow',
    };
  } else {
    boundaryColor = {
      transparent: true,
    };
  }
  return (
    <>
      <Box
        position={[0, 0, props.width]}
        dimensions={[props.length * 2, 50, 1]}
        collision={true}
        {...boundaryColor}
      />
      <Box
        position={[0, 0, -props.width]}
        dimensions={[props.length * 2, 50, 1]}
        collision={true}
        {...boundaryColor}
      />

      <Box
        position={[-props.length, 0, 0]}
        dimensions={[1, 50, props.width * 2]}
        collision={true}
        {...boundaryColor}
      />

      <Box
        position={[props.length, 0, 0]}
        dimensions={[1, 50, props.width * 2]}
        collision={true}
        {...boundaryColor}
      />
    </>
  );
}

/**
 * Defines a basic floor component as a flat plane rotated 90 degrees
 * This floor is partially transparent and will come with gridlines to
 * calibrate movement.
 */
export default function Floor(props: FloorProps) {
  const [ref] = usePlane(() => ({
    rotation: [-Math.PI / 2, 0, 0],
  }));

  return (
    <>
      {props.boundary && (
        <>
          <Boundaries
            length={props.length}
            width={props.width}
            debug={props.debug}
          />
        </>
      )}
      <mesh ref={ref} rotation={[-Math.PI / 2, 0, 0]}>
        <planeBufferGeometry
          attach="geometry"
          args={[props.length * 2, props.width * 2]}
        />
        <meshBasicMaterial
          attach="material"
          color="#000000"
          transparent="true"
          opacity={0.25}
        />
      </mesh>

      <gridHelper args={[2 * props.length, 2 * props.width, 'black', 'grey']} />
    </>
  );
}
