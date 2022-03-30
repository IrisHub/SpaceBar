import React, { useMemo } from 'react';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { useLoader } from '@react-three/fiber';
import { getS3Path } from '../utils';
import { useConvexPolyhedron } from '@react-three/cannon';
import { Geometry } from 'three-stdlib';

// @ts-ignore
function toConvexProps(bufferGeometry) {
  const geo = new Geometry().fromBufferGeometry(bufferGeometry);
  // Merge duplicate vertices resulting from glTF export.
  // Cannon assumes contiguous, closed meshes to work
  geo.mergeVertices();
  return [geo.vertices.map((v) => [v.x, v.y, v.z]), geo.faces.map((f) => [f.a, f.b, f.c]), []]; // prettier-ignore
}
// @ts-ignore
function GLTFCollision(props) {
  const { nodes } = useLoader(
    GLTFLoader,
    getS3Path('models/gunship/scene.gltf'),
  );
  console.log(nodes);
  //@ts-ignore
  const geo = useMemo(() => toConvexProps(nodes[0]), [nodes]);
  const [ref] = useConvexPolyhedron(() => ({ mass: 100, ...props, args: geo }));
  return (
    <mesh
      castShadow
      receiveShadow
      ref={ref}
      //@ts-ignore
      geometry={nodes[0]}
      {...props}
    >
      <meshStandardMaterial />
    </mesh>
  );
}
export default GLTFCollision;
