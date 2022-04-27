import React, { createRef } from 'react';
import { PlaneProps, usePlane } from '@react-three/cannon';

/**
 * CustomBox extends props
 * for useBox hook used to render a box in Cannon.JS's physics engine
 */
interface CustomPlane extends PlaneProps {
  color?: string;
  transparent?: boolean;
  rotation?: [number, number, number];
  dimensions: [number, number];
  collision?: boolean;
}

/**
 * Cylinder component renders a cylinder with collision detection.
 * This component accepts props that determine its size, position, type, and mass,
 * and a callback to be called upon a collision.
 * @param props customCylinder
 * @returns
 */
export default function Plane(props: CustomPlane) {
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
      position: props.position,
      type: props.type,
      rotation: props.rotation,
      onCollide: props.onCollide,
      ...props,
    }));
    meshProps = {
      ref: collisionRef,
    };
  } else {
    meshProps = {
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
        />
      </mesh>
    </>
  );
}
