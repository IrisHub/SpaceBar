import { EventEmitter } from 'events';
import { serialize } from './playerMovementHelpers';
import { PlayerPosition } from '../allTypes';
import movementLog from './playerMovementLog';

let ee = new EventEmitter();
ee.on('send_coords', async (data: PlayerPosition) => {
  const packagedData = serialize(data);
  movementLog.push(packagedData);
});

export default ee;
