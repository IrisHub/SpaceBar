import React from 'react';

import { WorldBoundariesProps } from '../allTypes';
import { Boundary, Colors, Dims } from '../constants';
import Plane from '../World/Shapes/Plane';

/**
 * Renders a boundary of 4 impassible Planes that define the edges of the world.
 * Each plane is a 2D surface that extends infinitely in 3d space.
 * Given a length (x-coord) and width (z-coord), planes are positioned & rotated to span the 4 edges of
 * the world. Each boundary is translucent by default, and yellow if debug is set to true.
 * @param props: PlaneProps
 * @returns Boundaries component
 */
function Boundaries(props: WorldBoundariesProps) {
  const boundaryColorConfig = {
    color: Colors.debugYellow,
    transparent: !props.debug,
  };

  return (
    <>
      <Plane // North
        position={[0, 0, -Dims.floorZ]}
        dimensions={[Dims.floorX * 2, Boundary.visiblePlaneHeight]}
        collision={true}
        rotation={[0, 0, 0]}
        {...boundaryColorConfig}
      />

      <Plane // South
        position={[0, 0, Dims.floorZ]}
        dimensions={[Dims.floorX * 2, Boundary.visiblePlaneHeight]}
        collision={true}
        rotation={[0, Math.PI, 0]}
        {...boundaryColorConfig}
      />

      <Plane // West
        position={[-Dims.floorX, 0, 0]}
        dimensions={[Dims.floorZ * 2, Boundary.visiblePlaneHeight]}
        collision={true}
        rotation={[0, Math.PI / 2, 0]}
        {...boundaryColorConfig}
      />

      <Plane // East
        position={[Dims.floorX, 0, 0]}
        dimensions={[Dims.floorZ * 2, Boundary.visiblePlaneHeight]}
        collision={true}
        rotation={[0, -Math.PI / 2, 0]}
        {...boundaryColorConfig}
      />
    </>
  );
}

export default Boundaries;
