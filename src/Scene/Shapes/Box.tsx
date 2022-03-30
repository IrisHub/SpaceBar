import React from 'react';
import { BoxProps, useBox } from '@react-three/cannon';

interface MyBox extends BoxProps{
  color: string
}
/**
 * CollisionObject component renders an object with collision detection.
 * This component accepts props that determine its size, position, type, and mass,
 * and a callback to be called upon a collision.
 *
 * TODO: Support passing props for multiple shapes rather than just a sphere...
 * @param props args: Array<number>, mass: number, position: Triplet, type: string, onCollide: Function
 * @returns
 */
export default function Box(props: MyBox) {

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
      <meshPhongMaterial color= {props.color} />
    </mesh>
  );
}
