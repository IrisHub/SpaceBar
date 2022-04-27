import React from 'react';
import { PlaneProps } from '../allTypes';
import { Plane } from '../Shapes';
import { Dims, Colors } from '../constants';

/**
 * Defines a basic floor component as a flat plane rotated 90 degrees
 * This floor comes with gridlines to
 * calibrate movement.
 */
export default function Floor(props: PlaneProps) {
  return (
    <>
      <Plane
        color={Colors.black}
        dimensions={[props.lengthX * 2, props.widthZ * 2]}
        rotation={[-Math.PI / 2, 0, 0]}
        collision={true}
      />

      <gridHelper
        args={[Dims.floorX, Dims.floorZ, Colors.black, Colors.grey]}
      />
    </>
  );
}
