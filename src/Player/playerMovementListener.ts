import { EventEmitter } from 'events';
let ee = new EventEmitter();

ee.on('send_coords', (data) => {
  
  console.log(data);
});

export default ee;

