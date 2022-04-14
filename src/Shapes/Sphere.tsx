import React, { createRef } from 'react';
import { SphereProps, useSphere } from '@react-three/cannon';

/**
 * CustomSphere extends props
 * for useSphere hook used to render a sphere in Cannon.JS's physics engine
 */
interface CustomSphere extends SphereProps {
  color: string;
  dimensions: [number];
  collision: boolean;
}
/**
 * Sphere component renders a sphere with collision detection.
 * This component accepts props that determine its size, position, type, and mass,
 * and a callback to be called upon a collision.
 * @param props CustomSphere
 * @returns
 */
export default function Sphere(props: CustomSphere) {
  let collisionRef = createRef();
  if (props.collision) {
    [collisionRef] = useSphere(() => ({
      args: props.dimensions,
      mass: props.mass,
      position: props.position,
      type: props.type,
      onCollide: props.onCollide,
      ...props,
    }));
  }

  return (
    <>
      {props.collision && (
        <mesh ref={collisionRef}>
          <sphereBufferGeometry args={props.dimensions} />
          <meshPhongMaterial color={props.color} />
        </mesh>
      )}

      {!props.collision && (
        <mesh position={props.position}>
          <sphereBufferGeometry args={props.dimensions} />
          <meshPhongMaterial color={props.color} />
        </mesh>
      )}
    </>
  );
}
