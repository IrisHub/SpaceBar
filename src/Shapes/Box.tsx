import React from 'react';
import { BoxProps, useBox } from '@react-three/cannon';

interface CustomBox extends BoxProps {
  color: string;
  dimensions: [number, number, number]
}
/**
 * Box component renders a box with collision detection.
 * This component accepts props that determine its size, position, type, and mass,
 * and a callback to be called upon a collision.
 * @param props customBox
 * @returns
 */
export default function Box(props: CustomBox) {
  const [collisionRef] = useBox(() => ({
    args: props.dimensions,
    mass: props.mass,
    position: props.position,
    type: props.type,
    onCollide: props.onCollide,
    ...props,
  }));

  return (
    <mesh ref={collisionRef}>
      <boxBufferGeometry args={props.dimensions} />
      <meshPhongMaterial color={props.color} />
    </mesh>
  );
}
