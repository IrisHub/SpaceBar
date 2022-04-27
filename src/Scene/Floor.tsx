import React from 'react';
import { PlaneProps } from '../allTypes';
import { Plane } from '../Shapes';

/**
 * Defines a basic floor component as a flat plane rotated 90 degrees
 * If boundary prop is passed, renders plane with collidable boundaries on each side of the plane.
 * This floor is partially transparent and will come with gridlines to
 * calibrate movement.
 */
export default function Floor(props: PlaneProps) {
  return (
    <>
      <Plane
        color="#000000"
        dimensions={[props.lengthX * 2, props.widthZ * 2]}
        rotation={[-Math.PI / 2, 0, 0]}
        collision={true}
      />

      <gridHelper
        args={[props.lengthX * 2, props.widthZ * 2, 'black', 'grey']}
      />
    </>
  );
}
