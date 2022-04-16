import React from 'react';
import { Canvas } from '@react-three/fiber';
import { Physics } from '@react-three/cannon';

import Player from '../Player/Player';
import PlayerCameraControls from '../Player/playerCameraControls';
import Floor from './Floor';
import Skybox from './Skybox';

import { Box, Cylinder, Sphere, GLTFModel } from '../Shapes';

import { getS3Path } from '../utils';
import { GRAVITY_CONSTANT, POINT_LIGHT_CONSTANT } from '../worldConstants';

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
        <pointLight position={POINT_LIGHT_CONSTANT} />
        <Physics gravity={GRAVITY_CONSTANT}>
          <Player />
          <Sphere
            dimensions={[10]}
            mass={10}
            position={[5, 1, -15]}
            type={'Static'}
            color={'gray'}
            collision={true}
          />

          <Box
            dimensions={[10, 10, 20]}
            mass={10}
            position={[5, 1, 5]}
            type={'Static'}
            collision={true}
            transparent={true}
          />

          <GLTFModel
            mass={10}
            position={[-50, 30, -50]}
            type={'Static'}
            modelScaleFactor={0.001}
            bboxScaleFactor={0.5}
            modelPath={getS3Path('models/gunship/scene.gltf')}
            collision={true}
          />

          <Cylinder
            dimensions={[10, 10, 5]}
            mass={10}
            position={[50, 1, -15]}
            type={'Static'}
            color={'green'}
            collision={false}
          />

          <GLTFModel
            mass={10}
            position={[5, 0, 50]}
            type={'Static'}
            modelScaleFactor={1}
            bboxScaleFactor={1}
            modelPath={getS3Path('models/smallBluePlant/scene.gltf')}
            collision={false}
          />

          <GLTFModel
            mass={10}
            position={[50, 0, 30]}
            type={'Static'}
            modelScaleFactor={1}
            bboxScaleFactor={0.5}
            modelPath={getS3Path('models/smallBluePlantPot/scene.gltf')}
            collision={false}
          />

          <GLTFModel
            mass={5}
            position={[-200, 1, -200]}
            type={'Static'}
            modelScaleFactor={0.3}
            bboxScaleFactor={0.4}
            modelPath={getS3Path('models/mushroomTree/scene.gltf')}
            collision={false}
          />

          <GLTFModel
            mass={10}
            position={[-90, 1, -20]}
            type={'Static'}
            modelScaleFactor={0.3}
            bboxScaleFactor={0.5}
            modelPath={getS3Path('models/mushroomTree/scene.gltf')}
            collision={true}
          />

          <GLTFModel
            mass={10}
            position={[50, 1, 65]}
            type={'Static'}
            modelScaleFactor={0.3}
            bboxScaleFactor={0.5}
            modelPath={getS3Path('models/mushroomTree/scene.gltf')}
            collision={true}
          />

          <Floor />
          <gridHelper args={[100, 100, 'black', 'grey']} />
        </Physics>
      </Canvas>
    </div>
  );
}
