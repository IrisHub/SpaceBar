import SignalingClient from './signalingClient';
import { CommunicatorCallback } from './utils';
import log from 'loglevel';

export enum CommunicatorChannel {
    PEER,   // Peer => Other Peer
    SERVER, // Peer => Server => Other Peer
}

/**
 * Communicator is the API layer for peer to peer connection and communication via WebRTC or WebSockets.
 */
export default class Communicator {    
    // TODO(SHALIN): Deploy to Heroku to get something like wss://spacebar-ws-2.herokuapp.com/
    private static socket_url = "localhost";
    private static socket_port = 3400;

    private signalingClient: SignalingClient;
    private roomID: string;

    constructor(roomID: string, debug = false) {
        log.setLevel(debug ? log.levels.DEBUG : log.levels.SILENT);

        this.roomID = roomID;
        this.signalingClient = new SignalingClient(Communicator.socket_url, Communicator.socket_port, this.roomID);
    }

    /** Returns whether or not we are connected to the other peer. */
    get peerConnected(): boolean {
        return this.signalingClient.isPeerConnected;
    }

    /** Returns whether or not we are connected to the signaling server. */
    get serverConnected(): boolean {
        return this.signalingClient.isSocketConnected;
    }

    /**
     * Send a message to the other peer.
     * @param data The data to send to the other peer.
     * @param channel The channel to send the data over.
     */
    send(data: any, channel = CommunicatorChannel.PEER) {
        switch (channel) {
            case CommunicatorChannel.PEER:
                this.signalingClient.sendPeer(data);
                break;
            case CommunicatorChannel.SERVER:
                this.signalingClient.sendWebsocket(data);
        }
    }

    /**
     * Register a callback to be called when events are fired from either the signaling server or the peer connection.
     * @param event The event to listen for.
     * @param callback The callback to call when the event is fired.
     */
    on(event: string, callback: CommunicatorCallback) {
        this.signalingClient.setEventCallback(event, callback);
    }
}
