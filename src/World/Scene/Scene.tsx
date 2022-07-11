import { Physics } from '@react-three/cannon';
import { Canvas } from '@react-three/fiber';
import React from 'react';

import {
  Colors,
  Mass,
  Objects,
  PhysicsConstants,
  Plants,
} from '../../constants';
import WorldBoundaries from '../../Scene/WorldBoundaries';
import Player from '../Player/Player';
import PlayerCameraControls from '../Player/PlayerCameraControls';
import { Box, Cylinder, GLTFModel, Sphere } from '../Shapes';
import Skybox from './Skybox';

/**
 * A "Scene" component that gathers all elements of the scene into
 * a single element that can then be rendered in App.tsx
 */
const Scene = () => {
  // export default function Scene() {
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
            type={'Static'}
          />

          <Box
            dimensions={[10, 10, 20]}
            mass={Mass.heavyObject}
            position={[25, 1, -15]}
            color={Colors.grey}
            collision={true}
            type={'Static'}
          />

          <GLTFModel
            mass={Mass.heavyObject}
            position={[-50, 30, -50]}
            modelScaleFactor={0.001}
            bboxScaleFactor={0.5}
            modelPath={Objects.gunshipPath}
            collision={true}
            type={'Static'}
          />

          <Cylinder
            dimensions={[10, 10, 5]}
            mass={Mass.heavyObject}
            position={[50, 1, -15]}
            color={Colors.green}
            collision={false}
            type={'Static'}
          />

          <GLTFModel
            mass={Mass.heavyObject}
            position={[5, 0, 50]}
            modelScaleFactor={1}
            bboxScaleFactor={1}
            modelPath={Plants.smallBluePlantPath}
            collision={false}
            type={'Static'}
          />

          <GLTFModel
            mass={Mass.heavyObject}
            position={[50, 0, 30]}
            modelScaleFactor={1}
            bboxScaleFactor={0.5}
            modelPath={Plants.smallBluePlantPotPath}
            collision={false}
            type={'Static'}
          />

          <GLTFModel
            mass={5}
            position={[-200, 1, -200]}
            modelScaleFactor={0.3}
            bboxScaleFactor={0.4}
            modelPath={Plants.mushroomTreePath}
            collision={false}
            type={'Static'}
          />

          <GLTFModel
            mass={Mass.heavyObject}
            position={[-90, 1, -20]}
            modelScaleFactor={0.3}
            bboxScaleFactor={0.5}
            modelPath={Plants.mushroomTreePath}
            collision={true}
            type={'Static'}
          />

          <GLTFModel
            mass={Mass.heavyObject}
            position={[50, 1, 65]}
            modelScaleFactor={0.3}
            bboxScaleFactor={0.5}
            modelPath={Plants.mushroomTreePath}
            collision={true}
            type={'Static'}
          />

          <WorldBoundaries />
        </Physics>
      </Canvas>
    </div>
  );
};
export default Scene;
