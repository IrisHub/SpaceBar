import { EventEmitter } from 'events';
import { serialize } from './playerMovementHelpers';
import { PlayerPosition } from '../allTypes';
import movementLog from './playerMovementLog';

/**
 * This module constructs a single eventEmitter to be used across components outside of React's lifecycle,
 * and listens for new player x,y,z coordinates on the send_coords channel.  Upon updates, serializes and writes to the 
 * in-memory movementLog.
 */

let ee = new EventEmitter();
ee.on('send_coords', async (data: PlayerPosition) => {
  const packagedData = serialize(data);
  movementLog.push(packagedData);
});

export default ee;
