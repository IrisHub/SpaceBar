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
  let opacity = 1;
  let transparent = false;
  if (props.transparent) {
    opacity = 0.0;
    transparent = true;
  }

  let meshProps;
  if (props.collision) {
    [collisionRef] = useSphere(() => ({
      args: props.dimensions,
      mass: props.mass,
      position: props.position,
      type: type,
      onCollide: props.onCollide,
      ...props,
    }));
    meshProps = {
      ref: collisionRef,
    };
  } else {
    meshProps = {
      position: props.position,
    };
  }

  return (
    <>
      <mesh {...meshProps}>
        <sphereBufferGeometry args={props.dimensions} />
        <meshPhongMaterial
          color={props.color}
          transparent={transparent}
          opacity={opacity}
        />
      </mesh>
    </>
  );
}
