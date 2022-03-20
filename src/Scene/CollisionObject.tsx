import React from 'react';
import { SphereProps, useSphere } from '@react-three/cannon';

export default function CollisionObject(props: SphereProps) {
  const [collisionRef] = useSphere(() => ({
    args: [10],
    color: 'lightgreen',
    mass: props.mass,
    position: props.position,
    type: 'Static',
    onCollide: () => console.log('I collided!'),
    ...props,
  }));

  return (
    <mesh ref={collisionRef}>
      <sphereBufferGeometry args={[10, 64, 64]} />
      <meshPhongMaterial color="lightgreen" />
    </mesh>
  );
}
