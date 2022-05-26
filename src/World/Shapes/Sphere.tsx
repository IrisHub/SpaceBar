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
 * @returns <Sphere>
 */
const Sphere = (props: CustomSphere) => {
  const { mass, position, type, onCollide, dimensions, color, transparent } =
    props;

  let collisionRef = createRef();
  const meshProps = {
    ref: props.collision ? collisionRef : undefined,
    position: props.position,
  };

  if (props.collision) {
    [collisionRef] = useSphere(() => ({
      args: dimensions,
      mass: mass,
      position: position,
      type: type,
      onCollide: onCollide,
      ...props,
    }));
  }

  return (
    <>
      <mesh {...meshProps}>
        <sphereBufferGeometry args={dimensions} />
        <meshPhongMaterial
          color={color}
          transparent={transparent}
          opacity={transparent ? 0.0 : 1.0}
        />
      </mesh>
    </>
  );
};

export default Sphere;
