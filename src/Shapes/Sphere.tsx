import React, { createRef } from 'react';
import { SphereProps, useSphere } from '@react-three/cannon';

/**
 * CustomSphere extends props
 * for useSphere hook used to render a sphere in Cannon.JS's physics engine
 */
interface CustomSphere extends SphereProps {
  color?: string;
  transparent?: boolean;
  dimensions: [number];
  collision?: boolean;
}
/**
 * Sphere component renders a sphere with collision detection.
 * This component accepts props that determine its size, position, type, and mass,
 * and a callback to be called upon a collision.
 * @param props CustomSphere
 * @returns
 */
export default function Sphere({ type = 'Static', ...props }: CustomSphere) {
  let collisionRef = createRef();
  const meshProps = {
    ref: props.collision ? collisionRef : undefined,
    position: props.position,
  };

  if (props.collision) {
    [collisionRef] = useSphere(() => ({
      args: props.dimensions,
      mass: props.mass,
      position: props.position,
      type: type,
      onCollide: props.onCollide,
      ...props,
    }));
  }

  return (
    <>
      <mesh {...meshProps}>
        <sphereBufferGeometry args={props.dimensions} />
        <meshPhongMaterial
          color={props.color}
          transparent={props.transparent}
          opacity={props.transparent ? 0.0 : 1.0}
        />
      </mesh>
    </>
  );
}
