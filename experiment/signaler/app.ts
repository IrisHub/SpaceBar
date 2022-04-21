import ws from 'ws';
import express from 'express';
import { PeerReceiver } from './receiver';

const app = express();
const port = 3400;

const wsServer = new ws.Server({ noServer: true });
const receiver = new PeerReceiver(wsServer);

// Listen on the specified port.
const server = app.listen(port, () => {
  console.log(`Example app listening on ${port}`);
});

// Test that the express webserver is running by sending a response.
app.get('/', (req, res) => {
  res.send('Signaling Server Basics!')
})

// Set up a headless websocket server that prints any
// events that come in.
wsServer.on('connection', socket => {
  socket.on('message', (data) => receiver.handleReceive(data));
});

// `server` is a vanilla Node.js HTTP server, so use
// the same ws upgrade process described here:
// https://www.npmjs.com/package/ws#multiple-servers-sharing-a-single-https-server
server.on('upgrade', (request, socket, head) => {
  wsServer.handleUpgrade(request, socket, head, socket => {
    wsServer.emit('connection', socket, request);
  });
});