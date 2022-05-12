import { Vector3 } from '@react-three/fiber';

/* Type PlayerPosition represents a player's x,y,z coordinates in 3D space.
   This is a light abstraction for a Vector3 */
export type PlayerPosition = Vector3 & {
  x: number;
  y: number;
  z: number;
};
/* Type PlayerVelocity represents a player's velocity in the x,y,z directions in 3D space.
 This is a light abstraction for a Vector3. PlayerVelocity shares the same properties 
 as PlayerPosition but is a separate type for semantic clarity.  */
export type PlayerVelocity = PlayerPosition;
