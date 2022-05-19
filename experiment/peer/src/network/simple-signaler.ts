import SimplePeer from "simple-peer";
import { json } from "stream/consumers";
import { collapseTextChangeRangesAcrossMultipleVersions } from "typescript";

// TODO(SHALIN): Move shared types to a shared folder in parent directory.
enum PayloadType {
    SIGNAL,
    CANDIDATE,
    DATA
}

interface Payload {
    id?: string;
    type: string;
    data: string;
}

/**
 * Creates a payload object to send to the signaling server.
 * @param type PayloadType, which gives the payload a type. 
 * @param data The data to be sent, which can be any type since it will be serialized to JSON.
 * @returns A serialized JSON string.
 */
 function createPayload(type: PayloadType, data: any, id?: string) {
    const payload: Payload = {
        id: id,
        type: PayloadType[type],
        data: JSON.stringify(data),
    };
    return JSON.stringify(payload);
}

class SimpleSignaler {
    private peer?: SimplePeer.Instance;
    private id?: string;
    private ws: WebSocket;
    
    constructor(initiator: boolean, socket_url: string, port: number) {
        // Create a new UUID for this peer, that we use in every message we send.
        // TODO(SHALIN): Make sure this is only generated once per peer, then cached.
        // If we close the tab and reopen, the behavior should be defined.

        // TODO(SHALIN): Verify that URL and PORT are valid.
        this.ws = new WebSocket(`ws://${socket_url}:${port}`);
        this.ws.onopen = (event) => {
            console.log("Websocket Connection Opened", event);
        };

        this.ws.onmessage = (event => { 
            // this._handleData(event);

            // Check if the data received was the generated ID that identifies us as the user.
            const receivedID = parse(event.data).id;
            if (!this.id && receivedID) { // Our Id was not set and we just received one from the server.
                this.id = receivedID;
                console.log(`We just received our id! ${this.id}`)

                // If it's indeed the correct ID, then start simple peer since now we have an ID.
                const Peer = (window as any)["SimplePeer"]; // Grab the SimplePeer class from the window object.
                this.peer = new Peer({
                    initiator: initiator, 
                    trickle: true,
                });
                this.createPeerConnection();
            } else {
                this._handleMessageFromWebsocket(event);
            }
        });
    }
    
    createPeerConnection() {
        this.peer?.on('signal', (data) => this._handlePeerSignal(data));
        this.peer?.on('connect', () => this._handlePeerConnection());
        this.peer?.on('error', (err) => this._handlePeerError(err));
        this.peer?.on('stream', (stream) => this._handlePeerStream(stream));
        this.peer?.on('data', (data) => this._handlePeerData(data));
        // peer.on('track', (track, stream) =>
        //   this._handleTrack(track, stream),
        // );
        this.peer?.on('close', () => this._handleClose());
    }

    // Functions that handle messages from the client and send to the signaling server.

    sendMessage(data: any) {
        console.log("send", data);
        const payload = createPayload(PayloadType.DATA, data, this.id);
        this.ws.send(payload);
    }


    // Functions that handle messages from the signaling server.
    _handleMessageFromWebsocket(event: MessageEvent<any>) {
        // just handle messages that we get from the websocket server.
        const data = parse(event.data);
        if (data.type === 'offer') {
            this.peer?.signal(data);
            console.log("we got an offer!", data);
        } else if (data.type === 'answer') {
            console.log("we got an answer, and now can establish a connection!", data);
            this.peer?.signal(data);
        } else if (data.type === 'candidate') {
            // lets try signaling the candidate
            console.log("we got a  candidate:", data.type);
            this.peer?.signal(data);
        } else {
            console.log("we got a  message other than an answer:", data.type);
        }
    }



    // Functions that handle messages that come from Simple peer listeners.

    _handlePeerSignal(data: SimplePeer.SignalData) {
        if (data.type === "answer") {
            console.log("sending answer to other peer", data);
            const payload = createPayload(PayloadType.SIGNAL, data, this.id);
            this.ws.send(payload);
        } else if (data.type === "offer") {
            console.log("sending offer to peer", data);
            const payload = createPayload(PayloadType.SIGNAL, data, this.id);
            this.ws.send(payload);
        } else if (data.type === "candidate") {
            console.log("sending candidates to peers");
            const payload = createPayload(PayloadType.SIGNAL, data, this.id);
            this.ws.send(payload);
        }
    }

    _handlePeerConnection() {
        console.log("_handleConnection (peer) connected!");

        const payload = createPayload(PayloadType.DATA, "HELLO WORLD OVER WEBRTC", this.id);
        this.peer?.send(payload);
    }

    _handlePeerError(err: Error) {
        console.log("_handleError", err);
    }

    _handlePeerStream(stream: MediaStream) {
        console.log("_handleStream", stream);
    }

    _handlePeerData(data: any) {
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