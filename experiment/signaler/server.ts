import WebSocket from 'ws';
import { v4 as uuid } from 'uuid';
import { PayloadType, createPayload, parse } from "./utils";
import { StringLiteralLike } from 'typescript';

export interface Peer {
    roomID: string; 
    id: string;
    initiator: boolean;
    ws?: WebSocket;
}

export interface Room {
    peers: Peer[];
}

export class SignalingServer {
    wss: WebSocket.Server<WebSocket.WebSocket>;

    // Keep track of the peers that join.
    rooms: Room[];

    constructor(wss: WebSocket.Server) {
        this.wss = wss;
        this.rooms = [];
    }

    // TODO(SHALIN): Make sure the caller scopes the `this` properly, or change the way these functions are called.
    // For example, calling this function such as `socket.on('message', (data) => receiver.handleReceive(data));` will work fine.
    // However calling this function as `socket.on('message', receiver.handleReceive);` changes what `this` refers to and breaks the code.
    handleReceive(ws: WebSocket, message: WebSocket.RawData) {
        const parsed = parse(message);
        const [type, data, id, roomID] = [parsed.type, parsed.data, parsed.id, parsed.roomID];

        console.log(`Received message of type: ${parsed.type}`);

        // TODO(SHALIN): Pull the `type`s from a shared types file instead of hardcoding the strings.
        switch (type) {
            case "JOIN_ROOM":
                // Pass the actual websocket to the receiver.
                this._handleJoinRoom(ws, roomID, id);
                break
            case "SIGNAL":
                this._handleSendSignal(roomID, id, data);
                break
            case "DATA":
                this._handleMessage(data);
                break
            case "CLOSE":
                // this._handleDisconnect(data);
                break
        }
    }

    ping() {
        // Send a pulse to all the clients.
    }

    pong() {
        // Check off the clients that are still connected.
    }

    // This is the first function called. It's when a new peer first tries to join a room.
    _handleJoinRoom(ws: WebSocket, roomID: string, id?: string) {
        // Create a peer with a given room ID.
        console.log("We just got sent the roomID: ", roomID);

        // Check if the room exists, if not create it.
        if (!(roomID in this.rooms)) {
            const room: Room = { peers: [] };
            this.rooms[roomID] = room;
        }

        this.createNewPeer(ws, roomID, id); 
    }

    // Creates a new peer.
    _createPeer(ws: WebSocket, roomID: string, initiator: boolean, id?: string) {
        console.log("Peer ID we got is", id);

        if (id) {
            const peersInRoom = this.rooms[roomID].peers;
            const currentPeer = peersInRoom.find(peer => peer.id === id);
            if (peersInRoom.length !== 0 && currentPeer) {
                return currentPeer;
            }
        }

        const peer: Peer = { roomID: roomID, id: uuid().toString(), initiator: initiator, ws: ws };
        return peer
    }

    createNewPeer(ws: WebSocket, roomID: string, id?: string) {        
        // Check if there are any other peers in this room.
        const peersInRoom = this.rooms[roomID].peers;
        console.log(`There are ${peersInRoom.length} peers in the room`);

        // If no peers found in this room, then the current peer is the initiator.
        const isInitiator = peersInRoom.length === 0;
        
        // Check if we've seen this peer before from a previous session.
        const cachedPeer = peersInRoom.find(peer => peer.id === id);

        // If there are one or more peers in the room, and cachedPeer exists,
        // then use the cached peer otherwise create new metadata for the peer.
        let peer: Peer;
        if (peersInRoom.length !== 0 && cachedPeer) {
            peer = cachedPeer;
        } else {
            // Create a new peer and add it to the room.
            peer = this._createPeer(ws, roomID, isInitiator, id);
            this.rooms[roomID].peers.push(peer);
        }

        // Send the peer it's metadata such as what ID we've assigned it, etc.
        const peerInfo = createPayload(PayloadType.NEW_PEER, peer, peer.id, peer.roomID);
        ws.send(peerInfo);

        // If our peer was NOT the initiator, meaning more than one peer has joined the same room, then
        // send all peers a HANDSHAKE message so they can start exchanging ICE candidates.
        if (!isInitiator) {
            peersInRoom.forEach(peer => {
                if (peer.ws.readyState === WebSocket.OPEN) {
                    const handshake = createPayload(PayloadType.HANDSHAKE, {});
                    peer.ws.send(handshake);
                }
            });
        }
    }

    checkStatus() {
        // Check if any of the clients are disconnected.
        // this.peers.forEach(peer => {
        //     if (this.connections[peer.id].readyState === WebSocket.CLOSED) {
        //         this.peers.splice(this.peers.indexOf(peer), 1);
        //         delete this.connections[peer.id];
        //     }
        // });

        // this.peers.forEach(peer => {
        //     const key = peer.id;
        //     const ws = this.connections[key];
        //     if (ws.readyState === WebSocket.CLOSED) {
        //         console.log("Client disconnected!");
        //     }
        // });
        console.log("checkStatus");
    }

    removePeer(peer: WebSocket) {
        // const key = Object.keys(this.connections).find(key => this.connections[key] === peer);
        // delete this.connections[key];
        // this.peers = this.peers.filter(p => p.id !== key);
        // console.log("removePeer", peer);
    }
    
    _handleSendSignal(roomID: string, peerID: string, message: WebSocket.RawData) { 
        const parsedMessage = parse(message);
        console.log("handleSendSignal", parsedMessage);

        // Send signal message to all clients except self.
        this.rooms[roomID].peers.forEach(peer => {
            if (peer.id !== peerID // Don't send to the client who originally sent the signal.
                && peer.ws.readyState === WebSocket.OPEN) {
                    const signal = createPayload(PayloadType.SIGNAL, parsedMessage);
                    peer.ws.send(signal);
                }
        });
    }
    
    _handleMessage(message: WebSocket.RawData) {
        console.log("handleMessage", parse(message));
    }
    
    _handleDisconnect(roomID: string, peerID: string, message: WebSocket.RawData) {


        // delete this.connections[key];
        // this.peers = this.peers.filter(p => p.id !== key);
        // console.log("handleDisconnect", parse(message));
    }
}