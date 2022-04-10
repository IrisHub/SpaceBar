import React from 'react';
import Player from '../Player/Player';
import { Canvas } from '@react-three/fiber';
import { Physics } from '@react-three/cannon';
import Floor from './Floor';
import PlayerCameraControls from '../Player/playerCameraControls';
import Skybox from './Skybox';
import Box from '../Shapes/Box';
import Sphere from '../Shapes/Sphere';
import { getS3Path } from '../utils';
import Cylinder from '../Shapes/Cylinder';
import GLTFCollisionModel from '../Shapes/GLTFCollision';
import { GRAVITY } from '../worldConstants';

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
        <Physics gravity={GRAVITY}>
          <Player />
          <Sphere
            dimensions={[10]}
            mass={10}
            position={[5, 1, -15]}
            type={'Static'}
            color={'red'}
          />

          <Box
            dimensions={[10, 10, 20]}
            mass={10}
            position={[25, 1, -15]}
            type={'Static'}
            color={'yellow'}
          />

      <GLTFCollisionModel
          mass={10}
          position={[-50, 30, -50]}
          type={'Static'}
          modelScaleFactor={0.001}
          bboxScaleFactor={0.5}
          modelPath={getS3Path('models/gunship/scene.gltf')}
          /> 

          <Cylinder
            dimensions={[10, 10, 5]}
            mass={10}
            position={[50, 1, -15]}
            type={'Static'}
            color={'green'}
          />

          <GLTFCollisionModel
          mass={10}
          position={[5, 0, 50]}
          type={'Static'}
          modelScaleFactor={1}
          bboxScaleFactor={1}
          modelPath={getS3Path('models/plant/scene.gltf')}
          /> 

      <GLTFCollisionModel
          mass={10}
          position={[50, 0, 30]}
          type={'Static'}
          modelScaleFactor={1}
          bboxScaleFactor={0.5}
          modelPath={getS3Path('models/plant2/scene.gltf')}
          /> 

        <GLTFCollisionModel
          mass={5}
          position={[-200, 1, -200 ]}
          type={'Static'}
          modelScaleFactor={0.3}
          bboxScaleFactor={0.}
          modelPath={getS3Path('models/mushroom_tree/scene.gltf')}
          /> 


        
       <GLTFCollisionModel
          mass={10}
          position={[-90, 1, -20 ]}
          type={'Static'}
          modelScaleFactor={0.3}
          bboxScaleFactor={0.5}
          modelPath={getS3Path('models/mushroom_tree/scene.gltf')}
          /> 

 
        <GLTFCollisionModel
          mass={10}
          position={[50, 1, 65 ]}
          type={'Static'}
          modelScaleFactor={0.3}
          bboxScaleFactor={0.5}
          modelPath={getS3Path('models/mushroom_tree/scene.gltf')}
          />  


          <Floor />
          <gridHelper args={[100, 100, 'black', 'grey']} />
        </Physics>
      </Canvas>
    </div>
  );
}
