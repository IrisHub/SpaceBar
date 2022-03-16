import React from 'react';
import Player from '../Player/Player';
import { Canvas } from '@react-three/fiber';
import { Physics } from '@react-three/cannon';
import Floor from './Floor';
import PlayerCameraControls from '../Player/playerCameraControls';
import SceneObject from './SceneObject';
import Skybox from './Skybox';
import Model from './Model';
import { getS3Path } from '../utils';


export default function Scene() {
  /**
   * A "Scene" component that gathers all elements of the scene into
   * a single element that can then be rendered in App.tsx
   */
  return (
    <div style={{ height: window.innerHeight }}>
      <Canvas>
        <PlayerCameraControls/>
        <Skybox/>
        <ambientLight/>
        <pointLight position={[10, 10, 10]}/>
          <Physics gravity={[0, -30, 0]}>
            <Player/>
            <SceneObject/>
            <Model position={[10, 11, 60]} modelPath={getS3Path('models/gunship/scene.gltf')} scaleFactor={0.03}/>
            <Floor/>
            <gridHelper args={[100, 100, 'black', 'grey']}/>
          </Physics>
      </Canvas>
    </div>
  );
}
