import WebSocket from 'ws';
import { v4 as uuid } from 'uuid';

export class PeerReceiver {
    wss: WebSocket.Server<WebSocket.WebSocket>;
    ws: WebSocket;
    id: string;
    roomCounter: number;
    websockets = {}; // Store all the websockets.

    constructor(ws: WebSocket.Server) {
        this.wss = ws;
        this.roomCounter = 0;
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
            case "NEW_PEER":
                this._handleNewPeer(data);
                break
            case "SIGNAL":
                this._handleSendSignal(id, data);
                break
            case "MESSAGE":
                this._handleMessage(data);
                break
            case "JOIN":
                this._handleJoin(data);
                break
            case "HANGUP":
                this._handleHangup(data);
                break
        }
    }
    
    _handleNewPeer(message: WebSocket.RawData) {
        console.log("handleNewPeer", parse(message));
        // This is  where we initiate the peer.
    }
    
    _handleSendSignal(clientID: string, message: WebSocket.RawData) { 
        const parsedMessage = parse(message);
        console.log("handleSendSignal", parsedMessage);

        // Send signal message to all clients except self.
        this.wss.clients.forEach(client => {
            if (client !== this.ws 
                && client !== this.websockets[clientID] // Don't send to the client who originally sent the signal.
                && client.readyState === WebSocket.OPEN) {
                console.log("sending to client")
                client.send(message);
            }
        });
        // this.ws.send(message);
    }
    
    _handleMessage(message: WebSocket.RawData) {
        console.log("handleMessage", parse(message));
    }
    
    _handleJoin(message: WebSocket.RawData) {
        const room = this._createRoom();
        console.log("handleCreateOrJoin", parse(message));
    }
    
    _handleHangup(message: WebSocket.RawData) {
        console.log("handleHangup", parse(message));
    }
    
    _handleDisconnect(message: WebSocket.RawData) {
        console.log("handleDisconnect", parse(message));
    } 

    _createRoom() {
        // const room = uuid().toString();
        // this.rooms.push(room);
        // this.roomCounter++;
        // console.log(`Added new room: ${room}. \n Total: ${this.roomCounter}`);
    }
}


// TODO(SHALIN): Move to some kind of utils file.
function parse(byteArray: WebSocket.RawData)  {
    return JSON.parse(byteArray.toString());
}
