import { useLoader } from '@react-three/fiber';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import React from 'react';


function Model() {
    
  const gltf = useLoader(GLTFLoader, './gunship/Unity2Skfb.gltf');
  return (
      <primitive object={gltf.scene} dispose={null} scale={3} />
  );
}

export default Model;