import React from 'react';
import { PlaneProps } from '../allTypes';
import Plane from '../Shapes/Plane';
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
  // let boundaryColor;

  // if (props.debug) {
  //   boundaryColor = {
  //     color: 'yellow',
  //   };
  // } else {
  //   boundaryColor = {
  //     transparent: true,
  //   };
  // }
  return (
    <>
      <Plane
        position={[0, 0, props.widthZ]}
        dimensions={[props.lengthX * 2, boundaryHeight]}
        type={'Static'}
        collision={true}
        rotation={[0, Math.PI, 0]}
        color="yellow"
        // {...boundaryColor}
      />
      <Plane
        position={[0, 0, -props.widthZ]}
        dimensions={[props.lengthX * 2, boundaryHeight]}
        type={'Static'}
        collision={true}
        rotation={[0, 0, 0]}
        color="yellow"

        // {...boundaryColor}
      />

      <Plane
        position={[-props.lengthX, 0, 0]}
        dimensions={[boundaryHeight, props.widthZ * 2]}
        type={'Static'}
        collision={true}
        rotation={[0, Math.PI / 2, 0]}
        color="blue"
        // {...boundaryColor}
      />

      <Plane
        position={[props.lengthX, 0, 0]}
        dimensions={[boundaryHeight, props.widthZ * 2]}
        type={'Static'}
        collision={true}
        rotation={[0, -Math.PI / 2, 0]}
        color="red"
        // {...boundaryColor}
      />
    </>
  );
}

export default Boundaries;
