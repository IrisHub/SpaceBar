import WebSocket from 'ws';
import { v4 as uuid } from 'uuid';
import { PayloadType, createPayload, parse } from "./utils";

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

export class SignalingServer {
    wss: WebSocket.Server<WebSocket.WebSocket>;

    // Keep track of the peers that join.
    rooms: Room[];
    connections: Connection[];

    constructor(wss: WebSocket.Server) {
        this.wss = wss;
        this.rooms = [];
        this.connections = [];
    }

    // TODO(SHALIN): Make sure the caller scopes the `this` properly, or change the way these functions are called.
    // For example, calling this function such as `socket.on('message', (data) => receiver.handleReceive(data));` will work fine.
    // However calling this function as `socket.on('message', receiver.handleReceive);` changes what `this` refers to and breaks the code.
    handleReceive(ws: WebSocket, message: WebSocket.RawData) {
        const parsed = parse(message);
        const [type, data, peerID, roomID] = [parsed.type, parsed.data, parsed.peerID, parsed.roomID];

        console.log(`Received message of type: ${parsed.type}`);

        // TODO(SHALIN): Pull the `type`s from a shared types file instead of hardcoding the strings.
        switch (type) {
            case "JOIN":
                // Pass the actual websocket to the receiver.
                this._handleJoinRoom(ws, roomID, peerID);
                break
            case "SIGNAL":
                this._handleSendSignal(roomID, peerID, data);
                break
            case "MESSAGE":
                this._handleMessage(data);
                break
        }
    }

    // This is the first function called. It's when a new peer first tries to join a room.
    _handleJoinRoom(ws: WebSocket, roomID: string, peerID?: string) {
        // Create a peer with a given room ID.
        console.log("We just got sent the roomID: ", roomID);

        // Check if the room exists, if not create it.
        if (!(roomID in this.rooms)) {
            const room: Room = { peers: [] };
            this.rooms[roomID] = room;
        }

        this.createNewPeer(ws, roomID, peerID); 
    }

    // Creates a new peer.
    _createPeer(ws: WebSocket, roomID: string, initiator: boolean, peerID?: string) {
        const peer: Peer = { roomID: roomID, peerID: peerID ? peerID : uuid().toString(), initiator: initiator, ws: ws };
        return peer
    }

    createNewPeer(ws: WebSocket, roomID: string, peerID?: string) {        
        // Check if there are any other peers in this room.
        const peersInRoom = this.rooms[roomID].peers;

        // Check if any of the peers are initiators.
        const initiatorsPresent = peersInRoom.find(peer => peer.initiator === true);
        
        // Check if we've seen this peer before from a previous session.
        const cachedPeer = peersInRoom.find(peer => peer.peerID === peerID);

        // If there are one or more peers in the room, and cachedPeer exists,
        // then use the cached peer otherwise create new metadata for the peer.
        let peer: Peer;
        if (peersInRoom.length !== 0 && cachedPeer) {
            peer = cachedPeer;
            peer.ws = ws;
        } else {
            // Create a new peer and add it to the room.
            // If none of the peers in the room are initiators, then make the current peer the initiator.
            peer = this._createPeer(ws, roomID, !initiatorsPresent, peerID);
            this.rooms[roomID].peers.push(peer);
        }

        // Cache the websocket object this peer is connected over so we can disconnect properly.
        const connection: Connection = { peer: peer, ws: ws };
        this.connections[peer.peerID] = connection;

        // Send the peer it's metadata such as what ID we've assigned it, etc.
        const peerInfo = createPayload(PayloadType.JOIN, peer, peer.peerID, peer.roomID);
        ws.send(peerInfo);

        // If there is more than one peer in the room, send all peers an INITIATE message so they 
        // can start exchanging ICE candidates. Otherwise wait until more than one person joins.
        console.log(`There are now ${peersInRoom.length} peers in the room`);
        if (peersInRoom.length > 1) {
            peersInRoom.forEach(peer => {
                if (peer.ws.readyState === WebSocket.OPEN) {
                    const handshake = createPayload(PayloadType.INITIATE, {});
                    peer.ws.send(handshake);
                }
            });
        }
    }
    
    _handleSendSignal(roomID: string, peerID: string, message: WebSocket.RawData) { 
        const parsedMessage = parse(message);
        console.log("handleSendSignal", parsedMessage);

        // Send signal message to all clients except self.
        this.rooms[roomID].peers.forEach(peer => {
            if (peer.peerID !== peerID // Don't send to the client who originally sent the signal.
                && peer.ws.readyState === WebSocket.OPEN) {
                    const signal = createPayload(PayloadType.SIGNAL, parsedMessage);
                    peer.ws.send(signal);
                }
        });
    }
    
    _handleMessage(message: WebSocket.RawData) {
        console.log("handleMessage", parse(message));
    }

    handleClose(ws: WebSocket, message: WebSocket.RawData) {
        // Find the peerID and roomID from the websocket instance.
        const peerID = Object.keys(this.connections).find(key => this.connections[key].ws === ws);
        const roomID = this.connections[peerID].peer.roomID;

        const peersInRoom = this.rooms[roomID].peers;

        // Delete a peer by `filter`ing instead of using `splice` with indices, since we 
        // could run into races if multiple clients are joining and leaving at the same time.
        this.rooms[roomID].peers = peersInRoom.filter(peer => peer.peerID !== peerID);

        // Remove the connection.
        delete this.connections[peerID];

        // If the room has no peers anymore, delete the room too.
        if (peersInRoom.length === 0) {
            delete this.rooms[roomID];
            console.log(`All peers left, room ${roomID} deleted`);
        }
        
        console.log("WEBSOCKET CLOSED");
    }
}