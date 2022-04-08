import React, { useMemo } from 'react';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { useLoader } from '@react-three/fiber';
import { getS3Path } from '../utils';
import { Box3 } from 'three';
import { BoxProps, useBox } from '@react-three/cannon';

export default function GLTFCollision(props: BoxProps) {
  const gltf = useLoader(
    GLTFLoader,
    getS3Path('models/gunship/scene.gltf'),
  );
  gltf.scene.scale.multiplyScalar(0.03);
  let bbox = useMemo(() => new Box3().setFromObject(gltf.scene), [gltf.scene]);
  const [collisionRef] = useBox(() => ({
    args: [bbox.min.x, bbox.min.y,  bbox.min.z],
    mass: props.mass,
    position: props.position,
    type: props.type,
    onCollide: props.onCollide,
  }));

  return (
    <primitive ref={collisionRef} position={props.position} object={gltf.scene} dispose={null} />
  );
}