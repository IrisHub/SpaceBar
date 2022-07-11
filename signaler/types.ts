import WebSocket from 'ws';

export interface Peer {
  roomID: string;
  peerID: string;
  initiator: boolean;
  ws?: WebSocket;
}

export interface Room {
  peers: Peer[];
}

export interface Connection {
  peer: Peer;
  ws: WebSocket;
}
