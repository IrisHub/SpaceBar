const express = require('express')
const app = express()
const port = 8080
const ws = require('ws')

app.get('/', (req, res) => {
  res.send('Signaling Server Basics!')
})

const server = app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})


// Set up a headless websocket server that prints any
// events that come in.

const wsServer = new ws.Server({ noServer: true });
wsServer.on('connection', socket => {
  socket.on('message', message => console.log(JSON.parse(message)));
});

// `server` is a vanilla Node.js HTTP server, so use
// the same ws upgrade process described here:
// https://www.npmjs.com/package/ws#multiple-servers-sharing-a-single-https-server
server.on('upgrade', (request, socket, head) => {
  wsServer.handleUpgrade(request, socket, head, socket => {
    wsServer.emit('connection', socket, request);
  });
});
