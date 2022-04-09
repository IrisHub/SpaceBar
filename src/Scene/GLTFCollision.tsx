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
export default function GLTFCollision(props: CustomGLTF) {
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