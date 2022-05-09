import React from 'react';
import { PlaneProps } from '../allTypes';
import Boundaries from './Boundaries';
import Floor from './Floor';

const WorldBoundaries = (props: PlaneProps) => {
  return (
    <>
      <Floor debug={props.debug} />
      <Boundaries debug={props.debug} />
    </>
  );
};

export default WorldBoundaries;
