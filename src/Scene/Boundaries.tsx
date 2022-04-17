import React from 'react';
import { PlaneProps } from '../allTypes';
import Box from '../Shapes/Box';

/**
 * Boundaries functional component renders four boundaries of a plane given
 * a plane's length and width.
 * @param props: PlaneProps
 * @returns
 */
function Boundaries(props: PlaneProps) {
  let boundaryColor;
  let boundaryHeight;

  if (!props.boundaryHeight) {
    boundaryHeight = 50;
  } else {
    boundaryHeight = props.boundaryHeight;
  }

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
