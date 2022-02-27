// import * as THREE from 'three';
import { usePlane } from '@react-three/cannon';
import React from 'react';

export const Floor = (props) => {
  const [ref] = usePlane(() => ({ rotation: [-Math.PI / 2, 0, 0], ...props }));
  //   const texture = useLoader(THREE.TextureLoader, grass)
  //   texture.wrapS = texture.wrapT = THREE.RepeatWrapping
  // map={texture} map-repeat={[240, 240]}

  return (
    <mesh ref={ref} receiveShadow>
      <planeGeometry args={[1000, 1000]} />
      <meshStandardMaterial color="green" />
    </mesh>
  );
};
