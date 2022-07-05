import Peer from './peer';
import SignalingClient from './signaler';
import { Payload, PayloadType, createPayload } from './utils';

// This is the API layer for peer to peer connection over WebRTC, including signaling.
class Communicator {
    // private peerID: string;
    
    // Create a test websocket connection to our node server in ../signaler/app.ts.
    // Eventually we want to use a real signaling server -- something like 
    // wss://spacebar-ws-2.herokuapp.com/
    private static socket_url = "localhost";
    private static socket_port = 3400;

    // private peer: Peer;
    private signaler: SignalingClient;
    private roomID: string;

    constructor(roomID: string) {
        // this.peerID = uuid();
        // this.peer = new Peer();
        this.roomID = roomID;
        this.signaler = new SignalingClient(Communicator.socket_url, Communicator.socket_port, this.roomID);
    }

    // Functions that handle sending messages to our connected peers.

    // sendMessage(data: any) {
    //     const payload = createPayload(PayloadType.DATA, data, this.peer.id);
    // }
}

export default Communicator;