import React from 'react';
import { WorldBoxProps } from '../allTypes';
import Boundaries from './Boundaries';
import Floor from './Floor';

/**
 * Renders a WorldBox: made from a Boundaries component & Floor component.
 * Boundaries renders 4 impassible Planes that define the edges of the world,
 * and Floor renders a horizontal, impassable Plane representing the
 * lowest reachable position in the Y direction.
 * @param props
 * @returns WorldBox component
 */
const WorldBox = (props: WorldBoxProps) => {
  return (
    <>
      <Floor debug={props.debug} />
      <Boundaries debug={props.debug} />
    </>
  );
};

export default WorldBox;
