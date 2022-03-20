import React from 'react';
import { SphereProps, useSphere } from '@react-three/cannon';

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
