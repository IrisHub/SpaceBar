import WebSocket from 'ws';
import { v4 as uuid } from 'uuid';
import { type } from 'os';
import { PayloadType, createPayload } from "./utils";
import { create } from 'domain';

export interface Peer {
    roomID: string; 
    id: string;
    initiator: boolean;
}

export class SignalingServer {
    wss: WebSocket.Server<WebSocket.WebSocket>;
    id: string;
    connections = {}; // Store all the websockets.

    // Store the room and the peers that join.
    roomID: string;
    peers: [Peer?];

    constructor(ws: WebSocket.Server) {
        this.wss = ws;
        this.roomID = uuid().toString();
        this.peers = [];
    }

    // TODO(SHALIN): Make sure the caller scopes the `this` properly, or change the way these functions are called.
    // For example, calling this function such as `socket.on('message', (data) => receiver.handleReceive(data));` will work fine.
    // However calling this function as `socket.on('message', receiver.handleReceive);` changes what `this` refers to and breaks the code.
    handleReceive(message: WebSocket.RawData) {
        const parsed = parse(message);
        const [type, data, id] = [parsed.type, parsed.data, parsed.id];

        console.log(`Received message of type: ${parsed.type}`);

        // TODO(SHALIN): Pull the `type`s from a shared types file instead of hardcoding the strings.
        switch (type) {
            case "SIGNAL":
                this._handleSendSignal(id, data);
                break
            case "DATA":
                this._handleMessage(data);
                break
        }
    }

    // Creates a new peer.
    _createPeer(initiator: boolean) {
        const id = uuid().toString();
        const peer: Peer = { roomID: this.roomID, id: id, initiator: initiator };
        return peer
    }

    createNewPeer(ws: WebSocket) {        
        // First check if this is the first peer or not.
        if (this.peers.length < 1) {
            // If it's the first peer, 
            const peer = this._createPeer(true);
            this.peers.push(peer);
            this.connections[peer.id] = ws;

            const peerInfo = createPayload(PayloadType.NEW_PEER, peer, peer.id);
            console.log("First peer!", peerInfo);
            ws.send(peerInfo);
        } else {
            console.log("Second peer!");
            // If it's not the first peer, first send the peer the created information
            const peer = this._createPeer(false);
            this.peers.push(peer);
            this.connections[peer.id] = ws;

            const peerInfo = createPayload(PayloadType.NEW_PEER, peer, peer.id);
            ws.send(peerInfo);

            // Then send ALL peers a handshake message so they can start sending ICE candidates.
            this.wss.clients.forEach(client => {
                if (client.readyState === WebSocket.OPEN) {
                    console.log("sending to client")
                    const handshake = createPayload(PayloadType.HANDSHAKE, {});
                    client.send(handshake);
                }
            });
        }
    }
    
    _handleSendSignal(clientID: string, message: WebSocket.RawData) { 
        const parsedMessage = parse(message);
        console.log("handleSendSignal", parsedMessage);

        // Send signal message to all clients except self.
        this.wss.clients.forEach(client => {
            if (client !== this.connections[clientID] // Don't send to the client who originally sent the signal.
                && client.readyState === WebSocket.OPEN) {
                console.log("sending to client")
                const signal = createPayload(PayloadType.SIGNAL, parsedMessage);
                client.send(signal);
            }
        });
    }
    
    _handleMessage(message: WebSocket.RawData) {
        console.log("handleMessage", parse(message));
    }
    
    _handleDisconnect(message: WebSocket.RawData) {
        console.log("handleDisconnect", parse(message));
    } 
}


// TODO(SHALIN): Move to some kind of utils file.
function parse(byteArray: WebSocket.RawData)  {
    return JSON.parse(byteArray.toString());
}
