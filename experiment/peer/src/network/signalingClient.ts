import PeerManager from "./peerManager";
import { load, parse, PayloadType, createPayload, save, CommunicatorCallback } from "./utils";
import log from "loglevel";

export default class SignalingClient {
    private ws: WebSocket;
    private peerManager: PeerManager;

    isPeerConnected: boolean = false;
    isSocketConnected: boolean = false;

    private onConnectCallback?: CommunicatorCallback;
    private onDisconnectCallback?: CommunicatorCallback;
    private onMessageCallback?: CommunicatorCallback;
    private onErrorCallback?: CommunicatorCallback;

    constructor(socket_url: string, port: number, roomID: string) {
        this.peerManager = new PeerManager(
            // Bind the current `this` to the callbacks so it refers to the SignalingClient instance.
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
            log.debug("Websocket Connection Closed", event);
        }
    }
    
    //
    // Websocket Handlers
    //

    /**
     * Handle incoming messages from the signaling server.
     * @param event The event object containing the message sent by the signaling server. 
     */
    _handleWebsocketReceive(event: any) {
        const receivedMetadata = parse(event.data);
        const type = receivedMetadata.type;

        switch (type) {
            case PayloadType[PayloadType.JOIN]:
                this._handleServerJoin(receivedMetadata);
                break
            case PayloadType[PayloadType.INITIATE]:
                this._handleServerInitiate(); 
                break
            case PayloadType[PayloadType.SIGNAL]:
                this._handleServerSignal(receivedMetadata);
                break
            case PayloadType[PayloadType.MESSAGE]:
                this._handleServerMessage(receivedMetadata);
                break
        }
    }

    /**
     * Handle when the websocket connection is opened.
     * @param event The metadata sent with the open event.
     * @param roomID The room ID that we intend on joining.
     */
    _handleWebsocketOpen(event: any, roomID: string) {
        log.debug("Websocket Connection Opened", event);
        this.isSocketConnected = true;
            
        // Check we currently have a saved peer id from a previous session.
        // If we do, use that one so the signaling server can reconnect us.
        const peer = load("peer");
        if (peer.peerID) {
            this.peerManager.peerID = peer.peerID;
            log.debug("This peer already existed. ID:", this.peerManager.peerID);
        }

        // As soon as the connection opens, tell the signaling server which room we'd like to join.
        const payload = createPayload(PayloadType.JOIN, {}, this.peerManager.peerID, roomID);
        this.ws.send(payload);
    }
    

    //
    // Signaling Server Handlers
    //

    /**
     * Handle when we receive a JOIN message from the signaling server.
     * @param metadata The metadata containing peer information.
     */
    _handleServerJoin(metadata: any) {
        const peer = parse(metadata.data);
        this.peerManager.peerID = peer.peerID;
        this.peerManager.roomID = peer.roomID;
        this.peerManager.isInitiator = peer.initiator;

        log.debug(`We just received our id ${peer.peerID} and we are ${peer.isInitiator ? "initiator" : "responder"}`);

        // Save this information locally.
        save("peer", peer);
    }

    /**
     * Handle when we receive an INITIATE message from the signaling server.
     */
    _handleServerInitiate() {
        this.peerManager.createPeer();
    }

    /**
     * Handle a signal recevied from the other peer.
     * @param metadata The metadata containing the signal.
     */
    _handleServerSignal(metadata: any) {
        const signal = parse(metadata.data);
        this.peerManager.handleSignal(signal)
    }

    /**
     * Handle when a peer sends data via the signaling server.
     * @param event The event metadata containing the message sent by the peer.
     */
    _handleServerMessage(event: any) {
        // We received a message from the other peer but via the signaling server.
        const data = parse(event.data);
        const message = parse(data);
        if (this.onMessageCallback) { this.onMessageCallback(message); }
    }

    //
    // Peer Handlers
    //

    /**
     * Handle when we receive a signal from the PeerManager, and send it to the signaling server
     * to route and send to the other peers.
     * @param data The signal that was received. 
     */
    _handlePeerSignal(data: any) {
        // Send it to the signaling server so it can be broadcasted to all relevant peers.
        const payload = createPayload(PayloadType.SIGNAL, data, this.peerManager.peerID, this.peerManager.roomID);
        this.ws.send(payload);
    }

    /**
     * Handle when a peer connection is established.
     * @param data The data that was sent with the connection event.
     */
    _handlePeerConnection(data: any) {
        this.isPeerConnected = true;
        if (this.onConnectCallback) { this.onConnectCallback(data); }
    }

    /**
     * Handle any errors that occur in the PeerManager.
     * @param err The error that occurred.
     */
    _handlePeerError(err: Error) {
        log.debug("Error: ", err);
        if (this.onErrorCallback) { this.onErrorCallback(err); }
    }

    /**
     * Handle when a peer connection closes.
     * @param data The data that was sent with the close event. 
     */
    _handlePeerClose(data: any) {
        if (this.onDisconnectCallback) { this.onDisconnectCallback(data); }
    }

    /**
     * Handle when we receive data from a peer.
     * @param event The event metadata containing the message sent by the peer.
     */
    _handlePeerData(event: any) {
        const data = parse(event);
        const message = parse(data.data);
        if (this.onMessageCallback) { this.onMessageCallback(message); }
    }

    //
    // Helper Functions
    //

    /**
     * Set the callback functions that will be called when events are fired from either 
     * the signaling server or the peer connection.
     * @param event The event to listen for.
     * @param callback The callback to call when the event is fired.
     */
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

    /**
     * Send a message to the other peer via direct peer connection.
     * @param data The data to send. 
     */
     sendPeer(data: any) {
        if (!this.isPeerConnected) {
            if (this.onErrorCallback) { 
                this.onErrorCallback(new Error("Error: Not connected to a peer."));
                return;
            }
        }
        this.peerManager.send(data);
    }

    /**
     * Send a message to the other peer via the signaling server.
     * @param data The data to send.
     */
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