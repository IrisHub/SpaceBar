import React from 'react';
import { SphereProps, useSphere } from '@react-three/cannon';

interface CustomSphere extends SphereProps{
  color: string
  dimensions: [number]

}
/**
 * Sphere component renders a sphere with collision detection.
 * This component accepts props that determine its size, position, type, and mass,
 * and a callback to be called upon a collision.
 * @param props CustomSphere
 * @returns
 */
export default function Sphere(props: CustomSphere) {

  const [collisionRef] = useSphere(() => ({
    args: props.dimensions,
    mass: props.mass,
    position: props.position,
    type: props.type,
    onCollide: props.onCollide,
    ...props,
  }));

  return (
    <mesh ref={collisionRef}>
      <sphereBufferGeometry args={props.dimensions} />
      <meshPhongMaterial color={props.color} />
    </mesh>
  );
}
