import SimplePeer from "simple-peer";
import { collapseTextChangeRangesAcrossMultipleVersions } from "typescript";
import { v4 as uuid } from 'uuid';

// TODO(SHALIN): Move shared types to a shared folder in parent directory.
enum PayloadType {
    SIGNAL,
    MESSAGE,
    HANGUP,
    NEW_PEER,
    JOIN,
}

/**
 * Creates a payload object to send to the signaling server.
 * @param type PayloadType, which gives the payload a type. 
 * @param data The data to be sent, which can be any type since it will be serialized to JSON.
 * @returns A serialized JSON string.
 */
 function createPayload(id: string, type: PayloadType, data: any) {
    const payload = {
        id: id,
        type: PayloadType[type],
        data: JSON.stringify(data),
    };
    return JSON.stringify(payload);
}

class SimpleSignaler {
    private peer?: SimplePeer.Instance;
    private id: string;
    private ws: WebSocket;
    
    constructor(initiator: boolean, socket_url: string, port: number) {
        // Create a new UUID for this peer, that we use in every message we send.
        // TODO(SHALIN): Make sure this is only generated once per peer, then cached.
        // If we close the tab and reopen, the behavior should be defined.
        this.id = uuid().toString();

        // TODO(SHALIN): Verify that URL and PORT are valid.
        this.ws = new WebSocket(`ws://${socket_url}:${port}`);
        this.ws.onopen = (event) => {
            console.log("Websocket Connection Opened", event);
            const Peer = (window as any)["SimplePeer"]; // Grab the SimplePeer class from the window object.
            this.peer = new Peer({
                initiator: initiator, 
                trickle: true,
            });
    
            this.createPeerConnection();
        };

        this.ws.onmessage = (event => { 
            // this._handleData(event);
            console.log(`message received, ${event.data}`);
            this.peer?.signal(parse(event.data));
        });
    }
    
    createPeerConnection() {
        this.peer?.on('signal', (data) => this._handleSignal(data));
        this.peer?.on('connect', () => this._handleConnection());
        this.peer?.on('error', (err) => this._handleError(err));
        this.peer?.on('stream', (stream) => this._handleStream(stream));
        this.peer?.on('data', (data) => this._handleData(data));
        // peer.on('track', (track, stream) =>
        //   this._handleTrack(track, stream),
        // );
        this.peer?.on('close', () => this._handleClose());
        
    }

    // Functions that handle messages from the client and send to the signaling server.

    sendMessage(data: any) {
        console.log("send", data);
        const payload = createPayload(this.id, PayloadType.MESSAGE, data);
        this.ws.send(payload);
    }


    // Functions that handle messages from the signaling server.

    _handleSignal(data: SimplePeer.SignalData) {
        console.log("_handleSignal", data);

        // this.ws.onopen = (event) => {
        //     console.log("Websocket Connection Opened", event);
        const payload = createPayload(this.id, PayloadType.SIGNAL, data);
        this.ws.send(payload);
        // };
    }

    _handleConnection() {
        console.log("_handleConnection (peer) connected!");
    }

    _handleError(err: Error) {
        console.log("_handleError", err);
    }

    _handleStream(stream: MediaStream) {
        console.log("_handleStream", stream);
    }

    _handleData(data: any) {
        console.log("_handleData from signaling server ", parse(data));
    }

    _handleClose() {
        console.log("_handleClose");
    }
}

// TODO(SHALIN): Move to some kind of utils file.
function parse(byteArray: any)  {
    return JSON.parse(byteArray.toString());
}


export default SimpleSignaler;