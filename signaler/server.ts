import log from 'loglevel';
import { v4 as uuid } from 'uuid';
import WebSocket from 'ws';

import { Connection, Peer, Room } from './types';
import { createPayload, parse, PayloadType } from './utils';

/**
 * SignalingServer that handles exchanging ICE candidates and connecting peers.
 */
export class SignalingServer {
  wss: WebSocket.Server<WebSocket.WebSocket>;

  // Keep track of the rooms, peers, and websocket connections made.
  rooms: Room[];

  connections: Connection[];

  /**
   * Initialize the SignalingServer.
   * @param {WebSocket.Server} wss WebSocket server instance.
   */
  constructor(wss: WebSocket.Server) {
    this.wss = wss;
    this.rooms = [];
    this.connections = [];
  }

  //
  // WebSocket Handler(s)
  //

  /**
     * Handles incoming WebSocket messages.
     * @param {WebSocket} ws WebSocket instance that sent the message.
     * @param {WebSocket.RawData} message Message received from the client.
     */
  handleReceive(ws: WebSocket, message: WebSocket.RawData) {
    const parsed = parse(message);
    const [type, data, peerID, roomID] = [
      parsed.type, parsed.data, parsed.peerID, parsed.roomID,
    ];

    log.debug(`Received message of type: ${parsed.type}`);

    switch (type) {
      case PayloadType[PayloadType.JOIN]:
        // Pass the actual websocket to the receiver.
        this._handleJoin(ws, roomID, peerID);
        break;
      case PayloadType[PayloadType.SIGNAL]:
        this._handleSignal(roomID, peerID, data);
        break;
      case PayloadType[PayloadType.MESSAGE]:
        this._handleMessage(roomID, peerID, data);
        break;
    }
  }

  /**
     * Handles a WebSocket disconnection.
     * @param {WebSocket} ws WebSocket instance that disconnected.
     */
  handleClose(ws: WebSocket) {
    // Find the peerID and roomID from the websocket instance.
    const peerID = Object.keys(this.connections).find(
      (key) => this.connections[key].ws === ws,
    );

    // If the connection with this PeerID is not found or undefined,
    // return early.
    if (!this.connections[peerID]) {
      return;
    }

    const roomID = this.connections[peerID].peer.roomID;
    const peersInRoom = this.rooms[roomID].peers;

    // Delete a peer by `filter`ing instead of using `splice` with
    // indices, since we could run into races if multiple clients
    // are joining and leaving at the same time.
    this.rooms[roomID].peers = peersInRoom.filter(
      (peer) => peer.peerID !== peerID,
    );

    // Remove the connection.
    delete this.connections[peerID];

    // If the room has no peers anymore, delete the room too.
    if (peersInRoom.length === 0) {
      delete this.rooms[roomID];
      log.debug(`No other peers in the room, room ${roomID} deleted.`);
    }

    log.debug('WebSocket Connection Closed.');
  }

  //
  // Peer Message Handler(s)
  //

  /**
     * Handles a new peer joining a room.
     * @param {WebSocket} ws WebSocket instance the peer is connecting from.
     * @param {string} roomID ID of the room the peer intends to join.
     * @param {string} peerID (Optional) ID of the peer.
     */
  _handleJoin(ws: WebSocket, roomID: string, peerID?: string) {
    log.debug(`Join Request Received with Room ID: ${roomID}`);

    // Check if the room exists. If not, create it.
    if (!(roomID in this.rooms)) {
      const room: Room = { peers: [] };
      this.rooms[roomID] = room;
    }

    // Create a new peer with the given room and peer ID.
    this._createNewPeer(ws, roomID, peerID);
  }

  /**
     * Handles a signal from a peer.
     * @param {string} roomID ID of the room the peer is in.
     * @param {string} peerID ID of the peer that sent the signal.
     * @param {WebSocket.RawData} signal Signal message from the peer.
     */
  _handleSignal(roomID: string, peerID: string, signal: WebSocket.RawData) {
    log.debug('Signal Received: \n', parse(signal));
    const data = createPayload(PayloadType.SIGNAL, signal);
    this._broadcast(roomID, peerID, data);
  }

  /**
     * Handles a message from a peer.
     * @param {string} roomID ID of the room the peer is in.
     * @param {string} peerID ID of the peer that sent the message.
     * @param {WebSocket.RawData} message Message from the peer.
     */
  _handleMessage(roomID: string, peerID: string, message: WebSocket.RawData) {
    log.debug('Message Received: \n', parse(message));
    const data = createPayload(PayloadType.MESSAGE, message);
    this._broadcast(roomID, peerID, data);
  }

  //
  // Helper Functions
  //

  /**
   * Creates a new peer with the given room and peer ID,
   * and adds it to the room.
   * @param {WebSocket} ws WebSocket instance the peer is connecting from.
   * @param {string} roomID ID of the room the peer intends to join.
   * @param {string} peerID (Optional) ID of the peer. If not provided, a new
   * ID will be generated.
   */
  _createNewPeer(ws: WebSocket, roomID: string, peerID?: string) {
    // Grab all the peers currently in the room.
    const peersInRoom = this.rooms[roomID].peers;

    // Check if any of the peers are initiators.
    const initiatorsPresent = peersInRoom.find(
      (peer) => peer.initiator === true,
    );

    // Check if we've seen this peer before from a previous session.
    const cachedPeer = peersInRoom.find((peer) => peer.peerID === peerID);

    let peer: Peer;

    if (peersInRoom.length !== 0 && cachedPeer) {
      // If there are one or more peers in the room, and cachedPeer exists,
      // then use the cached peer.
      peer = cachedPeer;
      peer.ws = ws;
    } else {
      // Otherwise create a new peer object and add it to the room.
      // If none of the peers in the room are initiators, then make
      // the current peer the initiator.
      peer = {
        roomID: roomID,
        peerID: peerID ? peerID : uuid().toString(),
        initiator: !initiatorsPresent,
        ws: ws,
      };
      this.rooms[roomID].peers.push(peer);
    }

    // Cache the websocket object this peer is connected over so we can
    // handle disconnect properly.
    const connection: Connection = { peer: peer, ws: ws };
    this.connections[peer.peerID] = connection;

    // Send the peer its metadata such as what ID we've assigned it, etc.
    const peerMetadata = createPayload(
      PayloadType.JOIN, peer, peer.peerID, peer.roomID,
    );
    ws.send(peerMetadata);

    // If there is more than one peer in the room, send all peers an INITIATE
    // message so they can start exchanging ICE candidates. Otherwise wait
    // until more than one person joins.
    log.debug(`There are now ${peersInRoom.length} peers in room ${roomID}.`);
    if (peersInRoom.length > 1) {
      peersInRoom.forEach((peer) => {
        if (peer.ws.readyState === WebSocket.OPEN) {
          const initiate = createPayload(PayloadType.INITIATE, {});
          peer.ws.send(initiate);
        }
      });
    }
  }

  /**
   * Send a message to all peers in a room except the one that
   * originally sent the message.
   * @param {string} roomID ID of the room to broadcast to.
   * @param {string}peerID ID of the peer that originally sent the message.
   * @param {string}message Message to send.
   */
  _broadcast(roomID: string, peerID: string, message: string) {
    this.rooms[roomID].peers.forEach((peer) => {
      // Don't send to the client who originally sent the message.
      if (peer.peerID !== peerID && peer.ws.readyState === WebSocket.OPEN) {
        peer.ws.send(message);
      }
    });
  }
}
