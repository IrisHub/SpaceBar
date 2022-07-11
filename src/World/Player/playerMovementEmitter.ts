import { EventEmitter } from 'events';

import { SimpleVector3 } from '../../types';
import movementLog from './playerMovementLog';
import { serialize } from './playerMovementUtils';

/**
 * This module constructs a single eventEmitter to be used across components outside of React's lifecycle,
 * and listens for new player x,y,z coordinates on the send_coords channel.  Upon updates, serializes and writes to the
 * in-memory movementLog.
 */
let playerMovementEmitter = new EventEmitter();
playerMovementEmitter.on('sendCoords', async (data: SimpleVector3) => {
  const packagedData = serialize(data);
  if (packagedData) {
    movementLog.push(packagedData);
  }
});

export default playerMovementEmitter;
