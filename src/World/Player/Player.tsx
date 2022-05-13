import { SphereProps, useSphere } from '@react-three/cannon';
import { useFrame, useThree } from '@react-three/fiber';
import React, { useEffect, useRef } from 'react';
import PlayerMovementControls from './PlayerMovementControls';
import playerMovementEmitter from './playerMovementEmitter';
import { PlayerPosition, PlayerVelocity } from '../../allTypes';
import { roundEntriesInVector, round } from './playerMovementUtils';
import { Vector3 } from 'three';
import { PlayerConstants, MathConstants } from '../../constants';

/**
 * Defines a custom player object (a default Cannon.js sphere) and handles player movement
 * Movement works by examining keypresses and updating the player's velocity (handled by Cannon.js)
 * according to keypress logic defined in ./playerMovementControls.ts.
 */
const Player = (props: SphereProps) => {
  const { forward, backward, left, right, jump } = PlayerMovementControls();
  const { camera } = useThree();
  const [playerRef, setPlayerRef] = useSphere(() => ({
    mass: PlayerConstants.mass,
    position: [0, 2, 0],
    type: 'Dynamic',
    ...props,
  }));
  const xVector = new Vector3();
  const zVector = new Vector3();
  const newVelocityVector = new Vector3();
  let pastPosition = new Vector3();
  let pastVelocity = new Vector3();

  const currentVelocityVector = useRef<PlayerVelocity>({ x: 0, y: 0, z: 0 });
  useEffect(() => {
    setPlayerRef.velocity.subscribe((playerVelocity) => {
      currentVelocityVector.current.x = round(
        playerVelocity[0],
        MathConstants.roundingPrecision
      );
      currentVelocityVector.current.y = round(
        playerVelocity[1],
        MathConstants.roundingPrecision
      );
      currentVelocityVector.current.z = round(
        playerVelocity[2],
        MathConstants.roundingPrecision
      );
    });
  }, [setPlayerRef.velocity]);

  useFrame(() => {
    let playerCurrentPosition: PlayerPosition = camera.position;
    if (playerRef.current != null) {
      playerRef.current.getWorldPosition(playerCurrentPosition); //Position of player copied to camera position
      playerCurrentPosition = roundEntriesInVector(playerCurrentPosition, 3);

      if (pastPosition !== playerCurrentPosition) {
        playerMovementEmitter.emit('sendCoords', playerCurrentPosition);
        pastPosition = playerCurrentPosition;
      }
    }

    zVector.set(0, 0, Number(forward) - Number(backward));
    xVector.set(Number(right) - Number(left), 0, 0);
    newVelocityVector
      .subVectors(xVector, zVector)
      .normalize()
      .multiplyScalar(PlayerConstants.jumpVelocity)
      .applyEuler(camera.rotation);
    setPlayerRef.velocity.set(
      newVelocityVector.x,
      currentVelocityVector.current.y,
      newVelocityVector.z
    );
    playerCurrentPosition = roundEntriesInVector(
      playerCurrentPosition,
      MathConstants.roundingPrecision
    );

    const canJump: boolean =
      jump &&
      Math.abs(currentVelocityVector.current.y) < 0.05 &&
      pastVelocity.y === currentVelocityVector.current.y; //Prevent infinite jumping
    if (canJump) {
      setPlayerRef.velocity.set(
        currentVelocityVector.current.x,
        PlayerConstants.jumpVelocity,
        currentVelocityVector.current.z
      );
    }
    pastVelocity.y = currentVelocityVector.current.y;
  });

  return (
    <React.Fragment>
      <mesh ref={playerRef} />
    </React.Fragment>
  );
};

export default Player;