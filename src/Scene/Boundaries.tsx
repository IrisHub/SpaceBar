import React from 'react';
import { PlaneProps } from '../allTypes';
import Plane from '../Shapes/Plane';

/**
 * Boundaries functional component renders four boundaries of a plane given
 * a plane's length and width. Collisions registered by using Box components with collisions to true.
 * Boundaries are fullytranslucent unless debug prop is set to true.
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
