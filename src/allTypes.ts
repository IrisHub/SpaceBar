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

export enum Directions {
  Up = 1,
  Down,
  Left,
  Right,
}