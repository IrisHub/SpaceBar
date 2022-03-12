import { useLoader } from '@react-three/fiber';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import React from 'react';

type ModelProps = {
  modelPath: string,
  scaleFactor: number
};
/**
 * Model is a simple wrapper for GLTFLoader.
 * @param props 
 * modelPath -> Path to gltf or glb folder or file. A valid path is a relative path from the public folder.
 * scaleFactor -> Factor to scale the x,y,z of the gltf.scene object.
 * 
 * @returns model to render
 */
function Model(props:ModelProps) {
  const gltf = useLoader(GLTFLoader, props.modelPath);
  gltf.scene.scale.set(props.scaleFactor * gltf.scene.scale.x, props.scaleFactor * gltf.scene.scale.y, props.scaleFactor * gltf.scene.scale.z);
  
  return (
      <primitive object={gltf.scene} dispose={null}  />
  );
}

export default Model;