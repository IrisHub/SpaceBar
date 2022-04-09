import React, { useMemo } from 'react';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { useLoader } from '@react-three/fiber';
import { Box3 } from 'three';
import { BoxProps, useBox } from '@react-three/cannon';
import { Vector3 } from 'three';

interface CustomGLTF extends BoxProps{
  modelScaleFactor: number
  bboxScaleFactor: number
  modelPath: string
}

/**
 * GLTFCollisionModel component renders a GLTF with a bounding box for collision detection.
 * This component accepts props that determine its size, position, type, 
 * a callback to be called upon a collision, path to GLTF to load, and scaling factors for the model and bbox.
 * @param props args: Array<number>, mass: number, position: Triplet, type: string, onCollide: Function,
 * modelScaleFactor: number, bboxScaleFactor: number, modelPath
 * @returns
 */
export default function GLTFCollisionModel(props: CustomGLTF) {
  const gltf = useLoader(
    GLTFLoader,
    props.modelPath,
  );
  gltf.scene.scale.multiplyScalar(props.modelScaleFactor);
  let bbox = useMemo(() => new Box3().setFromObject(gltf.scene), [gltf.scene]);

  const bboxSize = bbox.getSize(new Vector3());
  const scaledBbox = bboxSize.multiplyScalar(props.bboxScaleFactor).toArray();

  const [collisionRef] = useBox(() => ({
    args: scaledBbox, //Must accept array and not vector3
    mass: props.mass,
    position: props.position,
    type: props.type,
    onCollide: props.onCollide,
  }));

  return (
    <primitive ref={collisionRef} position={props.position} object={gltf.scene} dispose={null} />
  );
}