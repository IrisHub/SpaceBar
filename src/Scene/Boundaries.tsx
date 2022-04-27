import React from 'react';
import { PlaneProps } from '../allTypes';
import Box from '../Shapes/Box';
import { BOUNDARY_HEIGHT } from '../worldConstants';

/**
 * Boundaries functional component renders four boundaries of a plane given
 * a plane's length and width. Collisions registered by using Box components with collisions to true.
 * Boundaries are fullytranslucent unless debug prop is set to true.
 * @param props: PlaneProps
 * @returns
 */
function Boundaries(props: PlaneProps) {
  const boundaryHeight = BOUNDARY_HEIGHT;
  let boundaryColor;

  if (props.debug) {
    boundaryColor = {
      color: 'yellow',
    };
  } else {
    boundaryColor = {
      transparent: true,
    };
  }
  return (
    <>
      <Box
        position={[0, 0, props.widthZ]}
        dimensions={[props.lengthX * 2, boundaryHeight, 1]}
        collision={true}
        {...boundaryColor}
      />
      <Box
        position={[0, 0, -props.widthZ]}
        dimensions={[props.lengthX * 2, boundaryHeight, 1]}
        collision={true}
        {...boundaryColor}
      />

      <Box
        position={[-props.lengthX, 0, 0]}
        dimensions={[1, boundaryHeight, props.widthZ * 2]}
        collision={true}
        {...boundaryColor}
      />

      <Box
        position={[props.lengthX, 0, 0]}
        dimensions={[1, boundaryHeight, props.widthZ * 2]}
        collision={true}
        {...boundaryColor}
      />
    </>
  );
}

export default Boundaries;
