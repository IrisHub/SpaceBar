import React from 'react';
import { PlaneProps } from '../allTypes';
import Plane from '../Shapes/Plane';

/**
 * Creates a world boundary of 4 impassible Planes that define the edges of the world.
 * Each plane is a 2D surface that extends infinitely in 3d space.
 * Given a length (x-coord) and width (z-coord), planes are positioned & rotated to span the 4 edges of
 * the world. Each boundary is fully translucent unless the debug prop is set to true, in which
 * case they are set to yellow with a configurable visible height.
 * @param props: PlaneProps
 * @returns
 */
function Boundaries(props: PlaneProps) {
  let visibleBoundaryHeight = 10; //  Plane extends infinitely
  let boundaryColorConfig;

  if (props.debug) {
    boundaryColorConfig = {
      color: 'yellow',
    };
  } else {
    boundaryColorConfig = {
      transparent: true,
    };
  }
  return (
    <>
      <Plane
        position={[0, 0, props.widthZ]}
        dimensions={[props.lengthX * 2, visibleBoundaryHeight]}
        collision={true}
        rotation={[0, Math.PI, 0]}
        {...boundaryColorConfig}
      />
      <Plane
        position={[0, 0, -props.widthZ]}
        dimensions={[props.lengthX * 2, visibleBoundaryHeight]}
        collision={true}
        rotation={[0, 0, 0]}
        {...boundaryColorConfig}
      />

      <Plane
        position={[-props.lengthX, 0, 0]}
        dimensions={[props.widthZ * 2, visibleBoundaryHeight]}
        collision={true}
        rotation={[0, Math.PI / 2, 0]}
        {...boundaryColorConfig}
      />

      <Plane
        position={[props.lengthX, 0, 0]}
        dimensions={[props.widthZ * 2, visibleBoundaryHeight]}
        collision={true}
        rotation={[0, -Math.PI / 2, 0]}
        {...boundaryColorConfig}
      />
    </>
  );
}

export default Boundaries;
