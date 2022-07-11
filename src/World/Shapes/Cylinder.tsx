import { CylinderProps, useCylinder } from '@react-three/cannon';
import React, { useRef } from 'react';
import { Event, Object3D } from 'three';

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
  const { mass, dimensions, position, type, onCollide, transparent, color } =
    props;
  let collisionRef = useRef<Object3D<Event>>(null);

  const meshProps = {
    ref: props.collision ? collisionRef : undefined,
    position: props.position,
  };

  if (props.collision) {
    [collisionRef] = useCylinder(() => ({
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
        <cylinderBufferGeometry args={dimensions} />
        <meshPhongMaterial
          color={color}
          transparent={transparent}
          opacity={transparent ? 0.0 : 1.0}
        />
      </mesh>
    </>
  );
};

export default Cylinder;
