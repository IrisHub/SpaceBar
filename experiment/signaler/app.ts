import { v4 as uuid } from 'uuid';
import ws from 'ws';
import express from 'express';
import { SignalingServer } from './server';

const app = express();
const port = 3400;

const wss = new ws.Server({ noServer: true });
const signalingServer: SignalingServer = new SignalingServer(wss);

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
wss.on('open', (ws, request) => {
  // var wsID: string = uuid().toString();
  // console.log(`ID of Client: ${wsID}`);
  // signalingServer.id = wsID;
  // signalingServer.connections[wsID] = ws;
  // signalingServer.createNewPeer(ws); // Pass the actual websocket to the receiver.
  ws.on('message', (data) => signalingServer.handleReceive(ws, data));
  ws.on('close', (data) => signalingServer.handleClose(ws, data));
});

wss.on('disconnect', (ws) => {
  // Close the connection if the user explicitly closes the connection.
  console.log(`Client disconnected: ${ws.id}`);
  wss.clients.forEach(client => {
    if (client === ws) {
      signalingServer.removePeer(client);
    }
  });
  // TODO(SHALIN): Gracefully remove websocket connection so next time we can open a new one.
  console.log("connection closed");
});

// `server` is a vanilla Node.js HTTP server, so use
// the same ws upgrade process described here:
// https://www.npmjs.com/package/ws#multiple-servers-sharing-a-single-https-server
server.on('upgrade', (request, socket, head) => {
  wss.handleUpgrade(request, socket, head, socket => {
    wss.emit('open', socket, request);
  });
});