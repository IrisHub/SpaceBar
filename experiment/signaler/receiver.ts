import ws from 'ws';
import { v4 as uuid } from 'uuid';

export class PeerReceiver {
    ws: ws.Server<ws.WebSocket>;
    rooms: Array<string>;
    roomCounter: number;

    constructor(ws: ws.Server) {
        this.ws = ws;
        this.rooms = [""];
        this.roomCounter = 0;
    } 


    // TODO(SHALIN): Make sure the caller scopes the `this` properly, or change the way these functions are called.
    // For example, calling this function such as `socket.on('message', (data) => receiver.handleReceive(data));` will work fine.
    // However calling this function as `socket.on('message', receiver.handleReceive);` changes what `this` refers to and breaks the code.
    handleReceive(message: ws.RawData) {
        const parsedMessage = parse(message);
        const [type, data] = [parsedMessage.type, parsedMessage.data];
    
        console.log(`Received message of type: ${parsedMessage.type}`);

        // TODO(SHALIN): Pull the `type`s from a shared types file instead of hardcoding the strings.
        switch (type) {
            case "NEW_PEER":
                this._handleNewPeer(data);
                break
            case "SIGNAL":
                this._handleSendSignal(data);
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
    
    _handleNewPeer(message: ws.RawData) {
        console.log("handleNewPeer", parse(message));
        // This is  where we initiate the peer.
    }
    
    _handleSendSignal(message: ws.RawData) { 
        this._createPeer()
        console.log("handleSendSignal", parse(message));
    }
    
    _handleMessage(message: ws.RawData) {
        console.log("handleMessage", parse(message));
    }
    
    _handleJoin(message: ws.RawData) {
        console.log("handleCreateOrJoin", parse(message));
    }
    
    _handleHangup(message: ws.RawData) {
        console.log("handleHangup", parse(message));
    }
    
    _handleDisconnect(message: ws.RawData) {
        console.log("handleDisconnect", parse(message));
    } 

    _createPeer() {
        const room = uuid().toString();
        this.rooms.push(room);
        this.roomCounter++;
        console.log(`Added new room: ${room}. \n Total: ${this.roomCounter}`);
    }
}


// TODO(SHALIN): Move to some kind of utils file.
function parse(byteArray: ws.RawData)  {
    return JSON.parse(byteArray.toString());
}
