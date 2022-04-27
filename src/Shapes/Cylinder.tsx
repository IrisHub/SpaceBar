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
 * @returns
 */
export default function Cylinder({
  type = 'Static',
  ...props
}: CustomCylinder) {
  let collisionRef = createRef();
  let opacity = 1;
  let transparent = false;
  if (props.transparent) {
    opacity = 0.0;
    transparent = true;
  }
  let meshProps;
  if (props.collision) {
    [collisionRef] = useCylinder(() => ({
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
        <cylinderBufferGeometry args={props.dimensions} />
        <meshPhongMaterial
          color={props.color}
          transparent={transparent}
          opacity={opacity}
        />
      </mesh>
    </>
  );
}
