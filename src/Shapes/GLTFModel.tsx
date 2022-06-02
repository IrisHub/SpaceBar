import { BoxProps, useBox } from '@react-three/cannon';
import { useLoader } from '@react-three/fiber';
import React, { createRef, useMemo } from 'react';
import { Box3 } from 'three';
import { Vector3 } from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { SkeletonUtils } from 'three-stdlib';

interface CustomGLTF extends BoxProps {
  modelScaleFactor: number;
  bboxScaleFactor: number;
  modelPath: string;
  collision: boolean;
}

/**
 * GLTFModel component renders a GLTF with a bounding box for collision detection.
 *
 * This component accepts props that determine its size, position, type,
 * a callback to be called upon a collision, path to GLTF to load, and scaling factors for the model and bbox.
 *
 * The component loads a GLTF with the useLoader hook, makes memoized calls to clone the loaded scene
 * in order to be able to load multiple instances of the same GLTF, then scales the model and bounding box
 * to the provided props.  The scaled bounding box hooks into the Cannon physics engine with the useBox hook and returned collisionRef.
 * @param props customGLTF
 * @returns
 */
export default function GLTFModel(props: CustomGLTF) {
  const { scene } = useLoader(GLTFLoader, props.modelPath);
  // Must use Skeleton utils to support copies of skinned meshes https://github.com/mrdoob/three.js/issues/11573
  let copiedScene = useMemo(() => SkeletonUtils.clone(scene), [scene]);
  copiedScene.scale.multiplyScalar(props.modelScaleFactor);
  let collisionRef = createRef();
  if (props.collision) {
    let bbox = useMemo(
      () => new Box3().setFromObject(copiedScene),
      [copiedScene],
    );
    const bboxSize = bbox.getSize(new Vector3());
    const scaledBbox = bboxSize.multiplyScalar(props.bboxScaleFactor).toArray();
    [collisionRef] = useBox(() => ({
      args: scaledBbox, //Must accept array and not vector3
      mass: props.mass,
      position: props.position,
      type: props.type,
      onCollide: props.onCollide,
    }));
  }

  return (
    <>
      {props.collision ? (
        <primitive
          ref={collisionRef}
          position={props.position}
          object={copiedScene}
          dispose={null}
        />
      ) : (
        <primitive
          position={props.position}
          object={copiedScene}
          dispose={null}
        />
      )}
    </>
  );
}
