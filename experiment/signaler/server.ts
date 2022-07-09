import WebSocket from 'ws';
import { v4 as uuid } from 'uuid';
import { PayloadType, createPayload, parse } from "./utils";
import { Peer, Room, Connection } from "./types";
import log from 'loglevel';

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

        log.debug(`Received message of type: ${parsed.type}`);

        switch (type) {
            case PayloadType[PayloadType.JOIN]:
                // Pass the actual websocket to the receiver.
                this._handleJoin(ws, roomID, peerID);
                break
            case PayloadType[PayloadType.SIGNAL]:
                this._handleSignal(roomID, peerID, data);
                break
            case PayloadType[PayloadType.MESSAGE]:
                this._handleMessage(roomID, peerID, data);
                break
        }
    }

    //
    // Peer Message Handlers
    //

    // This is the first function called. It's when a new peer first tries to join a room.
    _handleJoin(ws: WebSocket, roomID: string, peerID?: string) {
        log.debug(`Join Request Received with Room ID: ${roomID}`);

        // Check if the room exists. If not, create it.
        if (!(roomID in this.rooms)) {
            const room: Room = { peers: [] };
            this.rooms[roomID] = room;
        }
 
        // Create a new peer with the given room and peer ID.
        this.createNewPeer(ws, roomID, peerID); 
    }

    _handleSignal(roomID: string, peerID: string, message: WebSocket.RawData) { 
        const parsedMessage = parse(message);
        log.debug("Signal Received: \n", parsedMessage);
        const signal = createPayload(PayloadType.SIGNAL, message);
        this.broadcast(roomID, peerID, signal);
    }
    
    _handleMessage(roomID: string, peerID: string, message: WebSocket.RawData) {
        log.debug("Message Received: \n", parse(message));
        const data = createPayload(PayloadType.MESSAGE, message);
        this.broadcast(roomID, peerID, data);
    }

    //
    // Helper Functions
    //

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
            peer = { 
                roomID: roomID, 
                peerID: peerID ? peerID : uuid().toString(), 
                initiator: !initiatorsPresent, 
                ws: ws 
            };
            this.rooms[roomID].peers.push(peer);
        }

        // Cache the websocket object this peer is connected over so we can handle disconnect properly.
        const connection: Connection = { peer: peer, ws: ws };
        this.connections[peer.peerID] = connection;

        // Send the peer it's metadata such as what ID we've assigned it, etc.
        const peerMetadata = createPayload(PayloadType.JOIN, peer, peer.peerID, peer.roomID);
        ws.send(peerMetadata);

        // If there is more than one peer in the room, send all peers an INITIATE message so they 
        // can start exchanging ICE candidates. Otherwise wait until more than one person joins.
        log.debug(`There are now ${peersInRoom.length} peers in the room.`);
        if (peersInRoom.length > 1) {
            peersInRoom.forEach(peer => {
                if (peer.ws.readyState === WebSocket.OPEN) {
                    const handshake = createPayload(PayloadType.INITIATE, {});
                    peer.ws.send(handshake);
                }
            });
        }
    }

    broadcast(roomID: string, peerID:string, message: string) {
        // Send signal message to all clients except self.
        this.rooms[roomID].peers.forEach(peer => {
            if (peer.peerID !== peerID // Don't send to the client who originally sent the signal.
                && peer.ws.readyState === WebSocket.OPEN) {
                    peer.ws.send(message);
                }
        });
    }

    //
    // WebSocket Handler(s)
    //

    handleClose(ws: WebSocket) {
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
            log.debug(`No other peers in the room, room ${roomID} deleted.`);
        }
        
        log.debug("WebSocket Connection Closed.");
    }
}