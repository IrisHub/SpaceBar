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
  maxBoundingBox: boolean
}
export default function GLTFCollision(props: CustomGLTF) {
  const gltf = useLoader(
    GLTFLoader,
    props.modelPath,
  );
  gltf.scene.scale.multiplyScalar(props.modelScaleFactor);
  let bbox = useMemo(() => new Box3().setFromObject(gltf.scene), [gltf.scene]);
  // let bboxArgs:Triplet;

  // if (props.maxBoundingBox){
  //   bboxArgs = [bbox.max.x, bbox.max.y,  bbox.max.z];
  // } else {
  //   bboxArgs = [bbox.min.x, bbox.min.y,  bbox.min.z];

  // }

  // let helper = new Box3Helper(bbox, new Color(0, 255, 0));

  const size = bbox.getSize(new Vector3());
  let bboxArr:Array<number> = Object.values(size);
  const scaledBbox = bboxArr.map(coord => coord * props.bboxScaleFactor);


  console.log(scaledBbox);

  const [collisionRef] = useBox(() => ({
    // @ts-ignore
    args: scaledBbox,
    mass: props.mass,
    position: props.position,
    type: props.type,
    onCollide: props.onCollide,
  }));

  return (
    <primitive ref={collisionRef} position={props.position} object={gltf.scene} dispose={null} />
  //   <mesh ref={collisionRef}>
  //   <boxBufferGeometry args={bboxArgs} />
  //   <meshPhongMaterial color={'yellow'} />
  // </mesh>
  );
}