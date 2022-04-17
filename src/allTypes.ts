export type PlayerPosition = {
  x: number;
  y: number;
  z: number;
};

export type PlayerVelocity = {
  x: number;
  y: number;
  z: number;
};

export type PlaneProps = {
  lengthX: number;
  widthZ: number;
  boundary?: boolean;
  boundaryHeight?: number;
  debug?: boolean;
};
