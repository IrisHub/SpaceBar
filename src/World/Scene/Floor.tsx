import React from 'react';
import { Plane } from '../Shapes';
// import { usePlane } from '@react-three/cannon';
import { WorldBoundariesProps } from '../../allTypes';
import { Colors, Dims } from '../../common/constants';

/**
 * Defines a basic floor component as a flat plane rotated 90 degrees
 * This floor is partially transparent and will come with gridlines to
 * calibrate movement.
 */
const Floor = (props: WorldBoundariesProps) => {
  return (
    <>
      <Plane
        color={Colors.grey}
        dimensions={[Dims.floorX, Dims.floorZ, Dims.floorX, Dims.floorZ]}
        rotation={[-Math.PI / 2, 0, 0]}
        collision={true}
        terrain={true}
        transparent={true}
      />
      {props.debug && (
        <gridHelper
          args={[Dims.floorX * 2, Dims.floorZ * 2, Colors.black, Colors.grey]}
        />
      )}
    </>
  );
};

export default Floor;
