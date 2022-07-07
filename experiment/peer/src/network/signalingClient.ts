import PeerManager from "./peerManager";
import { load, parse, PayloadType, createPayload, save, CommunicatorCallback } from "./utils";

export default class SignalingClient {
    private ws: WebSocket;
    private peerManager: PeerManager;
    private debug: boolean;

    isPeerConnected: boolean = false;
    isSocketConnected: boolean = false;

    private onConnectCallback?: CommunicatorCallback;
    private onDisconnectCallback?: CommunicatorCallback;
    private onMessageCallback?: CommunicatorCallback;
    private onErrorCallback?: CommunicatorCallback;

    constructor(socket_url: string, port: number, roomID: string, debug: boolean) {
        this.debug = debug;

        this.peerManager = new PeerManager(
            this._handlePeerSignal.bind(this),
            this._handlePeerConnection.bind(this),
            this._handlePeerData.bind(this),
            this._handlePeerClose.bind(this),
            this._handlePeerError.bind(this)
        );

        // TODO(SHALIN): Verify that URL and PORT are valid.
        this.ws = new WebSocket(`ws://${socket_url}:${port}`);

        this.ws.onopen = (event) => {
            this._handleWebsocketOpen(event, roomID);
        };

        this.ws.onmessage = (event) => {
            this._handleWebsocketReceive(event);
        }; 

        this.ws.onclose = (event) => {
            this.debug && console.log("Websocket Connection Closed", event);
        }
    }

    setEventCallback(event: string, callback: CommunicatorCallback) {
        switch (event) {
            case "connect":
                this.onConnectCallback = callback;
                break
            case "message":
                this.onMessageCallback = callback;
                break
            case "disconnect":
                this.onDisconnectCallback = callback;
                break    
            case "error":
                this.onErrorCallback = callback;
                break
        }
    }
    
    _handleWebsocketOpen(event: any, roomID: string) {
        this.debug && console.log("Websocket Connection Opened", event);
        this.isSocketConnected = true;
            
        // Check we currently have a saved peer id from a previous session.
        // If we do, use that one so the signaling server can reconnect us.
        const peer = load("peer");
        if (peer.peerID) {
            this.peerManager.peerID = peer.peerID;
            this.debug && console.log("This peer already existed. ID:", this.peerManager.peerID);
        }

        // As soon as the connection opens, tell the signaling server which room we'd like to join.
        const payload = createPayload(PayloadType.JOIN, {}, this.peerManager.peerID, roomID);
        this.ws.send(payload);
    }

    // Functions that handle messages from the signaling server.
    _handleWebsocketReceive(event: any) {
        const receivedMetadata = parse(event.data);
        const type = receivedMetadata.type;

        switch (type) {
            case PayloadType[PayloadType.JOIN]:
                this._handleWebsocketJoin(receivedMetadata);
                break
            case PayloadType[PayloadType.INITIATE]:
                this._handleWebsocketInitiate(); 
                break
            case PayloadType[PayloadType.SIGNAL]:
                this._handleWebsocketSignal(receivedMetadata);
                break
            case PayloadType[PayloadType.MESSAGE]:
                this._handleWebsocketMessage(receivedMetadata);
                break
        }
    }

    _handleWebsocketJoin(metadata: any) {
        const peer = parse(metadata.data);
        this.peerManager.peerID = peer.peerID;
        this.peerManager.roomID = peer.roomID;
        this.peerManager.isInitiator = peer.initiator;

        this.debug && console.log(`We just received our id ${peer.peerID} and we are ${peer.isInitiator ? "initiator" : "responder"}`);

        // Save this information locally.
        save("peer", peer);
    }

    _handleWebsocketInitiate() {
        this.peerManager.createPeer();
    }

    _handleWebsocketSignal(metadata: any) {
        const signal = parse(metadata.data);
        this.peerManager.signal(signal)
    }

    _handleWebsocketMessage(metadata: any) {
        // We received a message from the other peer but via the signaling server.
        if (this.onMessageCallback) { this.onMessageCallback(metadata); }
    }

    //
    // Peer Manager callback functions.
    //

    _handlePeerSignal(data: any) {
        // When we receive a signal from our PeerManager, send it to the signaling server so it can be broadcasted to all relevant peers.
        const payload = createPayload(PayloadType.SIGNAL, data, this.peerManager.peerID, this.peerManager.roomID);
        this.ws.send(payload);
    }

    _handlePeerConnection(data: any) {
        this.isPeerConnected = true;
        if (this.onConnectCallback) { this.onConnectCallback(data); }
    }

    _handlePeerError(err: Error) {
        this.debug && console.log("Error: ", err);
        if (this.onErrorCallback) { this.onErrorCallback(err); }
    }

    _handlePeerClose(data: any) {
        if (this.onDisconnectCallback) { this.onDisconnectCallback(data); }
    }

    _handlePeerData(event: any) {
        const message = parse(event);
        const data = parse(message.data);
        if (this.onMessageCallback) { this.onMessageCallback(data); }
    }

    // Send a message to the other peer.

    sendPeer(data: any) {
        if (!this.isPeerConnected) {
            if (this.onErrorCallback) { 
                this.onErrorCallback(new Error("Error: Not connected to a peer."));
                return;
            }
        }
        this.peerManager.send(data);
    }

    sendWebsocket(data: any) {
        if (!this.isSocketConnected) {
            if (this.onErrorCallback) { 
                this.onErrorCallback(new Error("Error: Not connected to the server."));
                return;
            }
        }
        const payload = createPayload(PayloadType.MESSAGE, JSON.stringify(data), this.peerManager.peerID, this.peerManager.roomID);
        this.ws.send(payload);
    }
}
