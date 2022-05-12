import { Vector3 } from '@react-three/fiber';

export type PlayerPosition = Vector3 & {
  x: number;
  y: number;
  z: number;
};

export type PlayerVelocity = PlayerPosition;

// export interface PlayerVelocity extends Vector3Props {
//   x: number;
//   y: number;
//   z: number;
// }
