import express from 'express';
import ws from 'ws';

const app = express();
const port = 3400;

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
const wsServer = new ws.Server({ noServer: true });
wsServer.on('connection', socket => {
  socket.on('message', handleMessage);
});

// `server` is a vanilla Node.js HTTP server, so use
// the same ws upgrade process described here:
// https://www.npmjs.com/package/ws#multiple-servers-sharing-a-single-https-server
server.on('upgrade', (request, socket, head) => {
  wsServer.handleUpgrade(request, socket, head, socket => {
    wsServer.emit('connection', socket, request);
  });
});

// TODO(SHALIN): Move to some kind of utils file.
function parse(byteArray: ws.RawData)  {
  return JSON.parse(byteArray.toString());
}

function handleMessage(message: ws.RawData) {
  const parsedMessage = parse(message);
  const [type, data] = [parsedMessage.type, parsedMessage.data];
  
  console.log(`Received message of type: ${parsedMessage.type}`);

  // TODO(SHALIN): Pull the `type`s from a shared types file instead of hardcoding the strings.
  switch (type) {
    case "NEW_PEER":
      handleNewPeer(data);
      break
    case "SIGNAL":
      handleSendSignal(data);
      break
    case "JOIN":
      handleJoin(data);
      break
    case "HANGUP":
      handleHangup(data);
      break
  }
}

function handleNewPeer(message: ws.RawData) {
  console.log("handleNewPeer", parse(message));
}

function handleSendSignal(message: ws.RawData) { 
  console.log("handleSendSignal", parse(message));
}

function handleJoin(message: ws.RawData) {
  console.log("handleCreateOrJoin", parse(message));
}

function handleHangup(message: ws.RawData) {
  console.log("handleHangup", parse(message));
}

function handleDisconnect(message: ws.RawData) {
  console.log("handleDisconnect", parse(message));
}