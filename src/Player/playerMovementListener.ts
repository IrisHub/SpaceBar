import { EventEmitter } from 'events';

type PlayerPosition = {
  x: number;
  y: number;
  z: number;
};

let ee = new EventEmitter();
export default ee;

ee.on('send_coords', async (data: PlayerPosition) => {
  console.log(data);
});
