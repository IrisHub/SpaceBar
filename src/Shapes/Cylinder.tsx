import React, { useRef } from 'react';
import { CylinderProps, useCylinder } from '@react-three/cannon';
import { Event, Object3D } from 'three';

/**
 * CustomCylinder extends props
 * for useCylinder hook used to render a cylinder in Cannon.JS's physics engine
 */
interface CustomCylinder extends CylinderProps {
  color: string;
  dimensions: [number, number, number];
  collision: boolean;
}
/**
 * Cylinder component renders a cylinder with collision detection.
 * This component accepts props that determine its size, position, type, and mass,
 * and a callback to be called upon a collision.
 * @param props customCylinder
 * @returns
 */
export default function Cylinder(props: CustomCylinder) {
  let collisionRef = useRef<Object3D<Event>>(null);

  if (props.collision) {
    [collisionRef] = useCylinder(() => ({
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
          <cylinderBufferGeometry args={props.dimensions} />
          <meshPhongMaterial color={props.color} />
        </mesh>
      )}

      {!props.collision && (
        <mesh position={props.position}>
          <cylinderBufferGeometry args={props.dimensions} />
          <meshPhongMaterial color={props.color} />
        </mesh>
      )}
    </>
  );
}
