import React from 'react';
import { PlaneProps } from '../allTypes';
import { Plane } from '../Shapes';
import { Colors, Dims } from '../constants';

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
}
