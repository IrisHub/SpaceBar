import React from 'react';

// import { usePlane } from '@react-three/cannon';
import { WorldBoundariesProps } from '../../allTypes';
import { Colors, Dims } from '../../constants';
import { Plane } from '../Shapes';

/**
 * Defines a basic floor component as a flat plane rotated 90 degrees
 * This floor is partially transparent and will come with gridlines to
 * calibrate movement.
 */
const Floor = (props: WorldBoundariesProps) => {
  return (
    <>
      <Plane
        color={Colors.black}
        dimensions={[Dims.floorX * 2, Dims.floorZ * 2]}
        rotation={[-Math.PI / 2, 0, 0]}
        collision={true}
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
