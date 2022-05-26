import React, { createRef } from 'react';
import { CylinderProps, useCylinder } from '@react-three/cannon';

/**
 * CustomCylinder extends props
 * for useCylinder hook used to render a cylinder in Cannon.JS's physics engine
 */
interface CustomCylinder extends CylinderProps {
  color?: string;
  transparent?: boolean;
  dimensions: [number, number, number];
  collision?: boolean;
}
/**
 * Cylinder component renders a cylinder with collision detection.
 * This component accepts props that determine its size, position, type, and mass,
 * and a callback to be called upon a collision.
 * @param props customCylinder
 * @returns <Cylinder>
 */
const Cylinder = (props: CustomCylinder) => {
  let collisionRef = createRef();

  const meshProps = {
    ref: props.collision ? collisionRef : undefined,
    position: props.position,
  };

  if (props.collision) {
    [collisionRef] = useCylinder(() => ({
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
        <cylinderBufferGeometry args={props.dimensions} />
        <meshPhongMaterial
          color={props.color}
          transparent={props.transparent}
          opacity={props.transparent ? 0.0 : 1.0}
        />
      </mesh>
    </>
  );
};

export default Cylinder;
