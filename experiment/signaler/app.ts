import ws from 'ws';
import express from 'express';
import { SignalingServer } from './server';
import log from "loglevel";

if (process.env.LOG_LEVEL != null) log.setLevel(process.env.LOG_LEVEL as log.LogLevelDesc);

const app = express();
const port = 3400;

const wss = new ws.Server({ noServer: true });
const signalingServer: SignalingServer = new SignalingServer(wss);

// Listen on the specified port.
const server = app.listen(port, () => {
  console.log(`Signaling Server Listening on Port ${port}`);
});

wss.on('open', (ws, request) => {
  ws.on('message', (data) => signalingServer.handleReceive(ws, data));
  ws.on('close', (_) => signalingServer.handleClose(ws));
});

// `server` is a vanilla Node.js HTTP server, so use
// the same ws upgrade process described here:
// https://www.npmjs.com/package/ws#multiple-servers-sharing-a-single-https-server
server.on('upgrade', (request, socket, head) => {
  wss.handleUpgrade(request, socket, head, socket => {
    wss.emit('open', socket, request);
  });
});