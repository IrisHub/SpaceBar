import { SphereProps, useSphere } from '@react-three/cannon';
import { useFrame, useThree } from '@react-three/fiber';
import React, { useEffect, useRef } from 'react';
import { playerMovementControls } from './playerMovementControls';
import playerMovementEmitter from './playerMovementEmitter';
import movementLog from './playerMovementLog';
import { PlayerPosition, PlayerVelocity } from '../allTypes';
import { roundEntriesInVector } from './playerMovementHelpers';
import { Vector3 } from 'three';

const SPEED = 10;
const JUMP_VELOCITY = 15;
const PLAYER_MASS = 15;

export default function Player(props: SphereProps) {
  /**
   * Defines a custom player object (a default Cannon.js sphere and handles player movement)
   * Movement works by examining keypresses and updating the player's velocity (handled by Cannon.js)
   * according to keypress logic defined in ./playerMovementControls.ts.
   */
  const { forward, backward, left, right, jump } = playerMovementControls();
  const { camera } = useThree();
  const [playerRef, setPlayerRef] = useSphere(() => ({
    mass: PLAYER_MASS,
    position: [0, 2, 0],
    type: 'Dynamic',
    ...props,
  }));
  const xVector = new Vector3();
  const zVector = new Vector3();
  const newVelocityVector = new Vector3();
  let pastPosition = new Vector3();

  const currentVelocityVector = useRef<PlayerVelocity>({ x: 0, y: 0, z: 0 });
  useEffect(() => {
    setPlayerRef.velocity.subscribe((playerVelocity) => {
      currentVelocityVector.current.x = playerVelocity[0];
      currentVelocityVector.current.y = playerVelocity[1];
      currentVelocityVector.current.z = playerVelocity[2];
    });
  }, [setPlayerRef.velocity]);

  useFrame(() => {
    let playerCurrentPosition:PlayerPosition = camera.position;    
    if (playerRef.current != null) {
      playerRef.current.getWorldPosition(playerCurrentPosition); //Position of player copied to camera position
      playerCurrentPosition = roundEntriesInVector(playerCurrentPosition, 3);

      if (pastPosition !== playerCurrentPosition) {
        playerMovementEmitter.emit('sendCoords', playerCurrentPosition);
        pastPosition = playerCurrentPosition;
        console.log(movementLog);
      }
    }

    zVector.set(0, 0, Number(forward) - Number(backward));
    xVector.set(Number(right) - Number(left), 0, 0);
    newVelocityVector.subVectors(xVector, zVector).normalize().multiplyScalar(SPEED).applyEuler(camera.rotation);
    setPlayerRef.velocity.set(newVelocityVector.x, currentVelocityVector.current.y, newVelocityVector.z);

    if (jump && Math.abs(currentVelocityVector.current.y ) < 0.05){
      setPlayerRef.velocity.set(currentVelocityVector.current.x, JUMP_VELOCITY,  currentVelocityVector.current.z);
    }
  });

  return (
    <React.Fragment>
      <mesh ref={playerRef} />
    </React.Fragment>
  );
}
