import React, { createRef } from 'react';
import { PlaneProps, usePlane } from '@react-three/cannon';
import { DoubleSide } from 'three';

/**
 * CustomBox extends props
 * for useBox hook used to render a box in Cannon.JS's physics engine
 */
interface CustomPlane extends PlaneProps {
  dimensions: [number, number];
  color?: string;
  transparent?: boolean;
  rotation?: [number, number, number];
  collision?: boolean;
}

/**
 * Plane component renders a plane with collision detection.
 * @param props customPlane
 * @returns
 */
export default function Plane({ type = 'Static', ...props }: CustomPlane) {
  let collisionRef = createRef();
  let opacity = 1;
  let transparent = false;
  if (props.transparent) {
    opacity = 0.0;
    transparent = true;
  }
  let meshProps;
  if (props.collision) {
    [collisionRef] = usePlane(() => ({
      args: props.dimensions,
      mass: props.mass,
      rotation: props.rotation,
      position: props.position,
      type: type,
      onCollide: props.onCollide,
      ...props,
    }));
    meshProps = {
      ref: collisionRef,
    };
  } else {
    meshProps = {
      rotation: props.rotation,
      position: props.position,
    };
  }

  return (
    <>
      <mesh {...meshProps}>
        <planeBufferGeometry args={props.dimensions} />
        <meshBasicMaterial
          color={props.color}
          transparent={transparent}
          opacity={opacity}
          side={DoubleSide}
        />
      </mesh>
    </>
  );
}