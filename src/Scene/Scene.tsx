
import React from 'react';
import Player from '../Player/Player';
import { Canvas } from '@react-three/fiber';
import { Physics } from '@react-three/cannon';
import Floor from './Floor';
import PlayerCameraControls from '../Player/playerCameraControls';
import SceneObject from './SceneObject';

export default function Scene() {
  /**
   * A "Scene" component that gathers all elements of the scene into
   * a single element that can then be rendered in App.tsx
   */
  return (
    <div style={{ height: window.innerHeight }}>
      <Canvas>
        <PlayerCameraControls/>
          <ambientLight/>
          <pointLight position={[10, 10, 10]}/>
            <Physics gravity={[0, -30, 0]}>
              <Player/>
              <SceneObject/>
            <Floor/>
        </Physics>
      </Canvas>
    </div>
  );
}