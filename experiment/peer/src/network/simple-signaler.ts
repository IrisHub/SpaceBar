import SimplePeer from "simple-peer";
import { collapseTextChangeRangesAcrossMultipleVersions } from "typescript";

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
 function createPayload(type: PayloadType, data: any) {
    const payload = {
        type: PayloadType[type],
        data: JSON.stringify(data),
    };
    return JSON.stringify(payload);
}

class SimpleSignaler {
    private peer: SimplePeer.Instance;
    private ws: WebSocket;
    
    constructor(peer: SimplePeer.Instance, socket_url: string, port: number) {
        this.peer = peer;

        // TODO(SHALIN): Verify that URL and PORT are valid.
        this.ws = new WebSocket(`ws://${socket_url}:${port}`);
    }
    
    createPeerConnection() {
        this.peer.on('signal', (data) => this._handleSignal(data));
        this.peer.on('connect', () => this._handleConnection());
        this.peer.on('error', (err) => this._handleError(err));
        this.peer.on('stream', (stream) => this._handleStream(stream));
        this.peer.on('data', (data) => this._handleData(data));
        // peer.on('track', (track, stream) =>
        //   this._handleTrack(track, stream),
        // );
        this.peer.on('close', () => this._handleClose());
        
    }

    // Functions that handle messages from the client and send to the signaling server.

    sendMessage(data: any) {
        console.log("send", data);
        const payload = createPayload(PayloadType.MESSAGE, data);
        this.ws.send(payload);
    }


    // Functions that handle messages from the signaling server.

    _handleSignal(data: SimplePeer.SignalData) {
        console.log("_handleSignal", data);

        this.ws.onopen = (event) => {
            console.log("Websocket Connection Opened", event);
            const payload = createPayload(PayloadType.SIGNAL, data);
            this.ws.send(payload);
        };
    }

    _handleConnection() {
        console.log("_handleConnection");
    }

    _handleError(err: Error) {
        console.log("_handleError", err);
    }

    _handleStream(stream: MediaStream) {
        console.log("_handleStream", stream);
    }

    _handleData(data: any) {
        console.log("_handleData", data);
    }

    _handleClose() {
        console.log("_handleClose");
    }

}

export default SimpleSignaler;