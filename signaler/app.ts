import express from 'express';
import log from 'loglevel';
import ws from 'ws';

import { SignalingServer } from './server';

// Create an environment variable called `LOG_LEVEL` to set the log level.
if (process.env.LOG_LEVEL) {
  log.setLevel(process.env.LOG_LEVEL as log.LogLevelDesc);
}

const app = express();
const port = 3400;

const wss = new ws.Server({ noServer: true });
const signalingServer: SignalingServer = new SignalingServer(wss);

// Listen on the specified port.
const server = app.listen(port, () => {
  console.log(`Signaling Server Listening on Port ${port}`);
});

wss.on('open', (websocket) => {
  websocket.on('message', (data) =>
    signalingServer.handleReceive(websocket, data),
  );
  websocket.on('close', () => signalingServer.handleClose(websocket));
});

// `server` is a vanilla Node.js HTTP server, so use
// the same ws upgrade process described here:
// https://www.npmjs.com/package/ws#multiple-servers-sharing-a-single-https-server
server.on('upgrade', (request, socket, head) => {
  wss.handleUpgrade(request, socket, head, (newSocket) => {
    wss.emit('open', newSocket, request);
  });
});
