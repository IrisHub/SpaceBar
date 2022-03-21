import { usePlane } from '@react-three/cannon';
import { useTexture } from '@react-three/drei';
import React from 'react';
import { RepeatWrapping } from 'three';
// import { TextureLoader } from 'three';

export default function Floor() {
  
  /**
   * Defines a basic floor component as a flat plane rotated 90 degrees
   * This floor is partially transparent and will come with gridlines to 
   * calibrate movement.
   */
  const height = useTexture('Export_height.png');
  height.wrapS = RepeatWrapping;
  height.wrapT = RepeatWrapping;
  const normal = useTexture('Export_normal.png');
  normal.wrapS = RepeatWrapping;
  normal.wrapT = RepeatWrapping;
  const colors = useTexture('Export_baseColor.png');
  colors.wrapS = RepeatWrapping;
  colors.wrapT = RepeatWrapping;
  const ao = useTexture('Export_ambientOcclusion.png');
  ao.wrapS = RepeatWrapping;
  ao.wrapT = RepeatWrapping;
  const roughness = useTexture('Export_roughness.png');
  roughness.wrapS = RepeatWrapping;
  roughness.wrapT = RepeatWrapping;
  const metalness = useTexture('Export_metallic.png');
  metalness.wrapS = RepeatWrapping;
  metalness.wrapT = RepeatWrapping;
  height.repeat.set(8, 8);
  normal.repeat.set(8, 8);
  colors.repeat.set(8, 8);
  ao.repeat.set(8, 8);
  roughness.repeat.set(8, 8);
  metalness.repeat.set(8, 8);
  const [ref] = usePlane(() => ({
    rotation: [-Math.PI / 2, 0, 0],
  }));
  return (
    <mesh ref={ref} rotation={[-Math.PI / 2, 0, 0]}>
      <planeBufferGeometry attach="geometry" args={[100, 100]}/>
      <meshStandardMaterial
        attach="material"
        // color="#FFFFFF"
        map={colors}
        aoMap={ao}
        displacementMap={height} 
        displacementScale={3}
        displacementBias={-1.5}
        normalMap={normal}
        normalScale={1}
        roughnessMap={roughness}
        metalnessMap={metalness}
      />
    </mesh>
  );
}