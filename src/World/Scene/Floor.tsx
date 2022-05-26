import React from 'react';
import { WorldBoxProps } from '../allTypes';

import { Plane } from '../Shapes';
import { Colors, Dims } from '../constants';
import { usePlane } from '@react-three/cannon';

/**
 * Defines a basic floor component as a flat plane rotated 90 degrees
 * This floor is partially transparent and will come with gridlines to
 * calibrate movement.
 */
const Floor = ((props: WorldBoxProps) => {
  // const [ref] = usePlane() => ({
  //   rotation: [-Math.PI / 2, 0, 0],
  // }));
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
