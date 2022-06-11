import React from 'react';
import { WorldBoundariesProps } from '../allTypes';
import Floor from '../World/Scene/Floor';
import Boundaries from './Boundaries';

/**
 * Renders WorldBoundaries: made from a Boundaries component & Floor component.
 * Boundaries renders 4 impassible Planes that define the edges of the world,
 * and Floor renders a horizontal, impassable Plane representing the
 * lowest reachable position in the Y direction.
 * @param props
 * @returns WorldBoundaries component
 */
const WorldBoundaries = (props: WorldBoundariesProps) => {
  return (
    <>
      <Floor debug={props.debug} />
      <Boundaries debug={props.debug} />
    </>
  );
};

export default WorldBoundaries;
