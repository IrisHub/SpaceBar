import React from 'react';
import Player from '../Player/Player';
import { Canvas } from '@react-three/fiber';
import { Physics } from '@react-three/cannon';
import Floor from './Floor';
import PlayerCameraControls from '../Player/playerCameraControls';
import Skybox from './Skybox';
// import GLTFModel from './GLTFModel';
import Box from './Shapes/Box';
import Sphere from './Shapes/Sphere';
// import { getS3Path } from '../utils';
import Cylinder from './Shapes/Cylinder';
import GLTFCollision from './GLTFCollision';

export default function Scene() {
  /**
   * A "Scene" component that gathers all elements of the scene into
   * a single element that can then be rendered in App.tsx
   */
  return (
    <div style={{ height: window.innerHeight }}>
      <Canvas>
        <PlayerCameraControls />
        <Skybox />
        <ambientLight />
        <pointLight position={[10, 10, 10]} />
        <Physics gravity={[0, -30, 0]}>
          <Player />
          <Sphere
            args={[10]}
            mass={10}
            position={[10, 1, 15]}
            type={'Static'}
            onCollide={() => console.log('I collided!')}
            color={'red'}
          />

          <Box
            args={[10, 10, 10]}
            mass={10}
            position={[25, 1, 15]}
            type={'Static'}
            onCollide={() => console.log('I also collided!')}
            color={'yellow'}
          />

          <Cylinder
            args={[10, 10, 10]}
            mass={10}
            position={[5, 1, 15]}
            type={'Static'}
            onCollide={() => console.log('I also collided!')}
            color={'green'}
          />

          {/* <GLTFModel
            position={[10, 11, 60]}
            modelPath={getS3Path('models/gunship/scene.gltf')}
            scaleFactor={0.03}
          /> */}

          <GLTFCollision
          mass={10}
          position={[25, 1, 15]}
          type={'Static'}
          onCollide={() => console.log('I also collided!')}
          /> 
          <Floor />
          <gridHelper args={[100, 100, 'black', 'grey']} />
        </Physics>
      </Canvas>
    </div>
  );
}
