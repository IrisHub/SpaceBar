import React from 'react';
import { Boundary, Colors, Dims } from '../constants';
import Plane from '../Shapes/Plane';

export type BoundaryProps = {
  debug?: boolean;
};

/**
 * Creates a world boundary of 4 impassible Planes that define the edges of the world.
 * Each plane is a 2D surface that extends infinitely in 3d space.
 * Given a length (x-coord) and width (z-coord), planes are positioned & rotated to span the 4 edges of
 * the world. Each boundary is fully translucent unless the debug prop is set to true, in which
 * case they are set to yellow.
 * @param props: PlaneProps
 * @returns Boundaries component
 */
function Boundaries(props: BoundaryProps) {
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
