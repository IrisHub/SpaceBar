import { SphereProps, useSphere } from '@react-three/cannon';
import { useFrame, useThree } from '@react-three/fiber';
import React, { useEffect, useRef } from 'react';
import { Vector3 } from 'three';
import { playerMovementControls } from './playerMovementControls';

const SPEED = 10;

export default function Player(props: SphereProps) {
  const { forward, backward, left, right } = playerMovementControls();
  const { camera } = useThree();
  const [playerRef, playerApi] = useSphere(() => ({
    mass: 10,
    position: [0, 2, 0],
    type: 'Dynamic',
    ...props,
  }));
  const xVector = new Vector3();
  const zVector = new Vector3();
  const playerVector = new Vector3();

  const velocity = useRef([0, 0, 0]);
  useEffect(()=>{
    playerApi.velocity.subscribe(v => (velocity.current = v));
  }, [playerApi.velocity]);

  useFrame(()=> {
    playerRef.current.getWorldPosition(camera.position);
    zVector.set(0, 0, Number(forward) - Number(backward));
    xVector.set(Number(right) - Number(left), 0, 0);
    console.log(zVector, xVector);
    playerVector.subVectors(xVector, zVector).normalize().multiplyScalar(SPEED).applyEuler(camera.rotation);
    playerApi.velocity.set(playerVector.x, velocity.current[1], playerVector.z);
  });

  return (
    <React.Fragment>
      <mesh ref={playerRef}/> 
    </React.Fragment>
  );
}