import React from 'react';
import { Canvas } from '@react-three/fiber';
import { Physics } from '@react-three/cannon';

import Player from '../Player/Player';
import PlayerCameraControls from '../Player/playerCameraControls';
import Floor from './Floor';
import Skybox from './Skybox';

import { Box, Cylinder, Sphere, GLTFModel } from '../Shapes';

import {
  PhysicsConstants,
  Plants,
  Objects,
  Colors,
  Dims,
  Mass,
} from '../constants';

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
        <pointLight position={PhysicsConstants.pointLight} />
        <Physics gravity={PhysicsConstants.gravity}>
          <Player />
          <Sphere
            dimensions={[10]}
            mass={Mass.heavyObject}
            position={[5, 1, -15]}
            color={Colors.green}
            collision={true}
          />

          <Box
            dimensions={[10, 10, 20]}
            mass={Mass.heavyObject}
            position={[25, 1, -15]}
            color={Colors.grey}
            collision={true}
          />

          <GLTFModel
            mass={Mass.heavyObject}
            position={[-50, 30, -50]}
            modelScaleFactor={0.001}
            bboxScaleFactor={0.5}
            modelPath={Objects.gunshipPath}
            collision={true}
          />

          <Cylinder
            dimensions={[10, 10, 5]}
            mass={Mass.heavyObject}
            position={[50, 1, -15]}
            color={Colors.green}
            collision={false}
          />

          <GLTFModel
            mass={Mass.heavyObject}
            position={[5, 0, 50]}
            modelScaleFactor={1}
            bboxScaleFactor={1}
            modelPath={Plants.smallBluePlantPath}
            collision={false}
          />

          <GLTFModel
            mass={Mass.heavyObject}
            position={[50, 0, 30]}
            modelScaleFactor={1}
            bboxScaleFactor={0.5}
            modelPath={Plants.smallBluePlantPotPath}
            collision={false}
          />

          <GLTFModel
            mass={5}
            position={[-200, 1, -200]}
            modelScaleFactor={0.3}
            bboxScaleFactor={0.4}
            modelPath={Plants.mushroomTreePath}
            collision={false}
          />

          <GLTFModel
            mass={Mass.heavyObject}
            position={[-90, 1, -20]}
            modelScaleFactor={0.3}
            bboxScaleFactor={0.5}
            modelPath={Plants.mushroomTreePath}
            collision={true}
          />

          <GLTFModel
            mass={Mass.heavyObject}
            position={[50, 1, 65]}
            modelScaleFactor={0.3}
            bboxScaleFactor={0.5}
            modelPath={Plants.mushroomTreePath}
            collision={true}
          />

          <Floor lengthX={Dims.floorX} widthZ={Dims.floorZ} />
        </Physics>
      </Canvas>
    </div>
  );
}
