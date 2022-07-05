// import SimplePeer from "simple-peer";
// import Peer from "../Peer";
import PeerManager from "./peer";
import { load, parse, PayloadType, createPayload, save } from "./utils";

class SignalingClient {
    private ws: WebSocket;
    private peerManager: PeerManager;

    constructor(socket_url: string, port: number, roomID: string) {
        this.peerManager = new PeerManager(
            this._handlePeerSignal.bind(this),
            this._handlePeerConnection.bind(this),
            this._handlePeerData.bind(this),
            this._handlePeerError.bind(this)
        );

        // TODO(SHALIN): Verify that URL and PORT are valid.
        this.ws = new WebSocket(`ws://${socket_url}:${port}`);
        this.ws.onopen = (event) => {
            console.log("Websocket Connection Opened", event);
            
            // Check we currently have a saved peer id from a previous session.
            // If we do, use that one so the signaling server can reconnect us.
            const peer = load("peer");
            if (peer.peerID) {
                this.peerManager.peerID = peer.peerID;
                console.log("This peer already existed!", this.peerManager.peerID);
            }

            // As soon as the connection opens, tell the signaling server which room we'd like to join.
            const payload = createPayload(PayloadType.JOIN, {}, this.peerManager.peerID, roomID);
            this.ws.send(payload);
        };

        this.ws.onmessage = (event) => {
            this._handleWebsocketReceive(event);
        }; 
        this.ws.onclose = (event) => {
            console.log("Websocket Connection Closed", event);
        }
    }

    // Functions that handle messages from the signaling server.
    _handleWebsocketReceive(event: any) {
        const receivedMetadata = parse(event.data);
        const type = receivedMetadata.type;

        switch (type) {
            case "JOIN":
                const peer = parse(receivedMetadata.data);
                this.peerManager.peerID = peer.peerID;
                this.peerManager.roomID = peer.roomID;
                this.peerManager.isInitiator = peer.initiator;

                console.log(`We just received our id ${peer.peerID} and we are ${peer.isInitiator ? "initiator" : "responder"}`);

                // Save this information locally.
                save("peer", peer);

                break
            case "INITIATE":
                this.peerManager.createPeer();
                break
            case "SIGNAL":
                this._handleWebsocketSignal(receivedMetadata);
                break
            case "MESSAGE":
                break
        }
    }

    _handleWebsocketSignal(event: any) {
        const data = parse(event.data);
        this.peerManager.signal(data)
    }


    // Functions that handle messages that come from Simple peer listeners.

    _handlePeerSignal(data: any) {
        const payload = createPayload(PayloadType.SIGNAL, data, this.peerManager.peerID, this.peerManager.roomID);
        this.ws.send(payload);
    }

    _handlePeerConnection(data: any) {
        console.log("Peers are connected.");
    }

    _handlePeerError(err: Error) {
        console.log("Error: ", err);
    }

    _handlePeerData(data: any) {
        console.log("Data received from Peer ", parse(data));
    }
}


export default SignalingClient;