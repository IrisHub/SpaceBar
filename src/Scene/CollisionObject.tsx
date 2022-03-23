import React from 'react';
import { SphereProps, useSphere } from '@react-three/cannon';

/**
 * CollisionObject component renders an object with collision detection.
 * This component accepts props that determine its size, position, type, and mass, 
 * and a callback to be called upon a collision.
 * 
 * TODO: Support passing props for multiple shapes rather than just a sphere...
 * @param props args: Array<number>, mass: number, position: Triplet, type: string, onCollide: Function
 * @returns
 */
export default function CollisionObject(props: SphereProps) {
  const [collisionRef] = useSphere(() => ({
    args: props.args,
    mass: props.mass,
    position: props.position,
    type: props.type,
    onCollide: props.onCollide,
    ...props,
  }));

  return (
    <mesh ref={collisionRef}>
      <sphereBufferGeometry args={[10, 64, 64]} />
      <meshPhongMaterial color="lightgreen" />
    </mesh>
  );
}
