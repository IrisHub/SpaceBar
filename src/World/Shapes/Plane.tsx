import React, { useEffect, useRef } from 'react';
import { PlaneProps, usePlane } from '@react-three/cannon';
import { DoubleSide, PlaneBufferGeometry } from 'three';
import { Event, Object3D } from 'three';
import { terrainMapGenerator } from '../../common/terrain';
import { Dims } from '../../common/constants';

/**
 * CustomPlane extends props
 * for usePlane hook used to render a plane in Cannon.JS's physics engine
 */
interface CustomPlane extends PlaneProps {
  dimensions: [number, number, number, number];
  color?: string;
  transparent?: boolean;
  rotation?: [number, number, number];
  collision?: boolean;
  terrain?: boolean;
}

/**
 * Plane component renders a plane with collision detection.
 * @param props customPlane
 * @returns Plane component
 */
export default function Plane({ type = 'Static', ...props }: CustomPlane) {
  const ref = useRef<PlaneBufferGeometry>();
  useEffect(() => {
    // TODO: make sure you don't commit magic numbers lmao
    const vertices = terrainMapGenerator(50, 0.6).flat();
    if (ref.current) {
      const { position } = ref.current?.attributes;
      for (let z = 0; z < Dims.floorZ; z++) {
        for (let x = 0; x < Dims.floorX; x++) {
          const index = z * Dims.floorZ + x;
          console.log(index);
          position.setZ(index, vertices[index] - 75);
        }
      }
      position.needsUpdate = true;
      ref.current.computeVertexNormals();
    }
  });
  let collisionRef = useRef<Object3D<Event>>(null);

  let meshProps = {
    ref: props.collision ? collisionRef : undefined,
    rotation: props.rotation,
    position: props.position,
  };

  if (props.collision) {
    [collisionRef] = usePlane(() => ({
      args: props.dimensions,
      mass: props.mass,
      rotation: props.rotation,
      position: props.position,
      type: type,
      onCollide: props.onCollide,
      ...props,
    }));
  }

  return (
    <>
      <mesh {...meshProps}>
        <planeBufferGeometry
          args={props.dimensions}
          ref={props.terrain ? ref : null}
        />
        <meshStandardMaterial
          color={props.color}
          transparent={props.transparent}
          opacity={props.transparent ? 1.0 : 0.0}
          side={DoubleSide}
          roughness={1.0}
        />
      </mesh>
    </>
  );
}
