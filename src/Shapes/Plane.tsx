import React, { createRef } from 'react';
import { PlaneProps, usePlane } from '@react-three/cannon';
import { DoubleSide } from 'three';

/**
 * CustomPlane extends props
 * for usePlane hook used to render a plane in Cannon.JS's physics engine
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
 * @returns Plane component
 */
export default function Plane({ type = 'Static', ...props }: CustomPlane) {
  let collisionRef = createRef();
  let meshProps = {
    ref: props.collision ? collisionRef : undefined,
    rotation: props.rotation,
    position: props.position,
  };

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
  }

  return (
    <>
      <mesh {...meshProps}>
        <planeBufferGeometry args={props.dimensions} />
        <meshBasicMaterial
          color={props.color}
          transparent={props.transparent}
          opacity={props.transparent ? 0.0 : 1.0}
          side={DoubleSide}
        />
      </mesh>
    </>
  );
}
