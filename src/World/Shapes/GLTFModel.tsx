import React, { useRef, useMemo } from 'react';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { useLoader } from '@react-three/fiber';
import { Box3, Event, Object3D } from 'three';
import { BoxProps, useBox } from '@react-three/cannon';
import { Vector3 } from 'three';
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
 * @returns <GLTFModel>
 */
const GLTFModel = (props: CustomGLTF) => {
  const { mass, position, type, onCollide, bboxScaleFactor, collision } = props;
  const { scene } = useLoader(GLTFLoader, props.modelPath);
  // Must use Skeleton utils to support copies of skinned meshes https://github.com/mrdoob/three.js/issues/11573
  let copiedScene = useMemo(() => SkeletonUtils.clone(scene), [scene]);
  copiedScene.scale.multiplyScalar(props.modelScaleFactor);
  let collisionRef = useRef<Object3D<Event>>(null);

  if (props.collision) {
    let bbox = useMemo(
      () => new Box3().setFromObject(copiedScene),
      [copiedScene]
    );
    const bboxSize = bbox.getSize(new Vector3());
    const scaledBbox = bboxSize.multiplyScalar(bboxScaleFactor).toArray();
    [collisionRef] = useBox(() => ({
      args: scaledBbox, //Must accept array and not vector3
      mass: mass,
      position: position,
      type: type,
      onCollide: onCollide,
    }));
  }

  return (
    <>
      {collision ? (
        <primitive
          ref={collisionRef}
          position={position}
          object={copiedScene}
          dispose={null}
        />
      ) : (
        <primitive position={position} object={copiedScene} dispose={null} />
      )}
    </>
  );
};

export default GLTFModel;
