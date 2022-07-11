import { BoxProps, useBox } from '@react-three/cannon';
import React, { useRef } from 'react';
import { Event, Object3D } from 'three';

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
 * @returns <Box>
 */
const Box = (props: CustomBox) => {
  const { mass, dimensions, position, type, onCollide, transparent, color } =
    props;

  let collisionRef = useRef<Object3D<Event>>(null);

  const meshProps = {
    ref: props.collision ? collisionRef : undefined,
    position: props.position,
  };

  if (props.collision) {
    [collisionRef] = useBox(() => ({
      args: dimensions,
      mass: mass,
      position: position,
      type: type,
      onCollide: onCollide,
      ...props,
    }));
  }
  return (
    <>
      <mesh {...meshProps}>
        <boxBufferGeometry args={dimensions} />
        <meshPhongMaterial
          color={color}
          transparent={transparent}
          opacity={transparent ? 0.0 : 1.0}
        />
      </mesh>
    </>
  );
};

export default Box;
