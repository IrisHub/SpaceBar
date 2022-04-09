import React from 'react';
import { BoxProps, useBox } from '@react-three/cannon';

interface CustomBox extends BoxProps {
  color: string;
}
/**
 * Box component renders a box with collision detection.
 * This component accepts props that determine its size, position, type, and mass,
 * and a callback to be called upon a collision.
 * @param props args: Array<number>, mass: number, position: Triplet, type: string, onCollide: Function
 * @returns
 */
export default function Box(props: CustomBox) {
  const [collisionRef] = useBox(() => ({
    args: props.args,
    mass: props.mass,
    position: props.position,
    type: props.type,
    onCollide: props.onCollide,
    ...props,
  }));

  return (
    <mesh ref={collisionRef}>
      <boxBufferGeometry args={props.args} />
      <meshPhongMaterial color={props.color} />
    </mesh>
  );
}
