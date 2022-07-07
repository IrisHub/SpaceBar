import SignalingClient from './signalingClient';
import { CommunicatorCallback } from './utils';

export enum CommunicatorChannel {
    PEER,
    SERVER,
}

// This is the API layer for peer to peer connection over WebRTC, including signaling.
export default class Communicator {    
    // Create a test websocket connection to our node server in ../signaler/app.ts.
    // Eventually we want to use a real signaling server -- something like 
    // wss://spacebar-ws-2.herokuapp.com/
    private static socket_url = "localhost";
    private static socket_port = 3400;

    private signalingClient: SignalingClient;
    private roomID: string;

    constructor(roomID: string, debug = false) {
        this.roomID = roomID;
        this.signalingClient = new SignalingClient(Communicator.socket_url, Communicator.socket_port, this.roomID, debug);
    }

    peerConnected() {
       return this.signalingClient.isPeerConnected; 
    }

    serverConnected() {
        return this.signalingClient.isSocketConnected; 
    }

    // Functions that handle sending messages to our connected peers.
    send(data: any, channel = CommunicatorChannel.PEER) {
        switch (channel) {
            case CommunicatorChannel.PEER:
                this.signalingClient.sendPeer(data);
                break;
            case CommunicatorChannel.SERVER:
                this.signalingClient.sendWebsocket(data);
        }
    }

    // Callback functions
    on(event: string, callback: CommunicatorCallback) {
        this.signalingClient.setEventCallback(event, callback);
    }
}