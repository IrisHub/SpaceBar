import { v4 as uuid } from 'uuid';
import ws from 'ws';
import express from 'express';
import { PeerReceiver } from './receiver';

const app = express();
const port = 3400;

const wss = new ws.Server({ noServer: true });
const receiver: PeerReceiver = new PeerReceiver(wss);

// Listen on the specified port.
const server = app.listen(port, () => {
  console.log(`Example app listening on ${port}`);
});

// Test that the express webserver is running by sending a response.
app.get('/', (req, res) => {
  res.send('Signaling Server Basics!')
});

// Set up a headless websocket server that prints any
// events that come in.
wss.on('connection', (ws, request) => {
  // ws.room=[""];
  var wsID: string = uuid().toString();
  console.log(`ID of Client: ${wsID}`);
  receiver.id = wsID;
  receiver.websockets[wsID] = ws;
  receiver.ws = ws; // Pass the actual websocket to the receiver.
  const message = { id: wsID, }
  
  ws.send(JSON.stringify({ id: wsID }));
  ws.on('message', (data) => receiver.handleReceive(data));
});

// `server` is a vanilla Node.js HTTP server, so use
// the same ws upgrade process described here:
// https://www.npmjs.com/package/ws#multiple-servers-sharing-a-single-https-server
server.on('upgrade', (request, socket, head) => {
  wss.handleUpgrade(request, socket, head, socket => {
    wss.emit('connection', socket, request);
  });
});