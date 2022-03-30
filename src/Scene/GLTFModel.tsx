import { useLoader } from '@react-three/fiber';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import React from 'react';

type ModelProps = {
  modelPath: string;
  scaleFactor: number;
  position: Array<number>;
};
/**
 * Model is a simple wrapper for GLTFLoader.
 * @param props
 * modelPath -> Path to gltf or glb folder or file. Paths can either be local or reference an S3 bucket.
 * scaleFactor -> Factor to scale the x,y,z of the gltf.scene object.
 * position -> Array of x,y,z coordinates to define the primitive's position in the scene. This is a small abstraction for
 *  the native position property present in scene objects, as primitive elements require their position to be directly modified.
 *
 * @returns model to render
 */
function GLTFModel(props: ModelProps) {
  const gltf = useLoader(GLTFLoader, props.modelPath);
  gltf.scene.scale.multiplyScalar(props.scaleFactor);

  return (
    <primitive position={props.position} object={gltf.scene} dispose={null} />
  );
}

export default GLTFModel;
