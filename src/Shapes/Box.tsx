import React, { createRef } from 'react';
import { BoxProps, useBox } from '@react-three/cannon';

/**
 * CustomBox extends props
 * for useBox hook used to render a box in Cannon.JS's physics engine
 */
interface CustomBox extends BoxProps {
  color?: string;
  transparent?: boolean;
  dimensions: [number, number, number];
  collision?: boolean;
}
/**
 * Box component renders a box with collision detection.
 * This component accepts props that determine its size, position, type, and mass,
 * and a callback to be called upon a collision.
 * @param props customBox
 * @returns
 */
export default function Box({ type = 'Static', ...props }: CustomBox) {
  let collisionRef = createRef();
  let opacity = 1;
  let transparent = false;

  if (props.transparent) {
    opacity = 0.0;
    transparent = true;
  }

  let meshProps;
  if (props.collision) {
    [collisionRef] = useBox(() => ({
      args: props.dimensions,
      mass: props.mass,
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
      position: props.position,
    };
  }

  return (
    <>
      <mesh {...meshProps}>
        <boxBufferGeometry args={props.dimensions} />
        <meshPhongMaterial
          color={props.color}
          transparent={transparent}
          opacity={opacity}
        />
      </mesh>
    </>
  );
}
