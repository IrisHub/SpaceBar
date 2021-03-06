import React, { useRef } from 'react';
import { BoxProps, useBox } from '@react-three/cannon';
import { Event, Object3D } from 'three';

/**
 * CustomBox extends props
 * for useBox hook used to render a box in Cannon.JS's physics engine
 */
interface CustomBox extends BoxProps {
  color: string;
  dimensions: [number, number, number];
  collision: boolean;
}
/**
 * Box component renders a box with collision detection.
 * This component accepts props that determine its size, position, type, and mass,
 * and a callback to be called upon a collision.
 * @param props customBox
 * @returns
 */
export default function Box(props: CustomBox) {
  let collisionRef = useRef<Object3D<Event>>(null);
  if (props.collision) {
    [collisionRef] = useBox(() => ({
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
          <boxBufferGeometry args={props.dimensions} />
          <meshPhongMaterial color={props.color} />
        </mesh>
      )}

      {!props.collision && (
        <mesh position={props.position}>
          <boxBufferGeometry args={props.dimensions} />
          <meshPhongMaterial color={props.color} />
        </mesh>
      )}
    </>
  );
}
