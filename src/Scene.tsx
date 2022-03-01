
import React from 'react';
import Player from './Player/Player';
import { Canvas } from '@react-three/fiber';
import { Physics } from '@react-three/cannon';
import Floor from './Scene/Floor';
import PlayerCameraControls from './Player/playerCameraControls';
import SceneObject from './Scene/SceneObject';

export default function Scene() {
  return (
    <div style={{ height: window.innerHeight }}>
      <Canvas>
        <PlayerCameraControls/>
          <ambientLight/>
          <pointLight position={[10, 10, 10]}/>
            <Physics>
              <Player/>
              <SceneObject/>
            <Floor/>
        </Physics>
      </Canvas>
    </div>
  );
}