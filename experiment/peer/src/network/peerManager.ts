import SimplePeer from 'simple-peer';
import { PayloadType, createPayload, PeerCallback } from "./utils";
 
/**
 * PeerManager is the abstraction layer over the SimplePeer library, managing the connection and communication
 * process between two (or more) peers.
 */
export default class PeerManager {
    private peer?: SimplePeer.Instance;

    // Peer information.
    isInitiator?: boolean;
    peerID?: string;
    roomID?: string;

    // Callback functions.
    onSignal: PeerCallback;
    onConnect: PeerCallback;
    onData: PeerCallback;
    onClose: PeerCallback;
    onError: PeerCallback;

    constructor(onSignal: PeerCallback, onConnect: PeerCallback, onData: PeerCallback, onClose: PeerCallback, onError: PeerCallback) {
        this.onSignal = onSignal;
        this.onConnect = onConnect;
        this.onData = onData;
        this.onClose = onClose;
        this.onError = onError;
    }

    /**
     * Create a new SimplePeer instance and listen for the callbacks.
     */
    createPeer() {
        const SimplePeer = (window as any)["SimplePeer"]; // Grab the SimplePeer class from the window object.
        this.peer = new SimplePeer({
            initiator: this.isInitiator,
            trickle: true,
        })
        this._handlePeerCallbacks();
    }

    /**
     * Handle the callbacks from the SimplePeer listener functions.
     */
    _handlePeerCallbacks() {
        this.peer?.on('signal', (data) => this.onSignal(data));
        this.peer?.on('connect', () => this.onConnect(null));
        this.peer?.on('data', (data) => this.onData(data));
        this.peer?.on('close', () => this.onClose(null));
        this.peer?.on('error', (err) => this.onError(err));
    }

    /**
     * Handle a signal received from the other peer.
     * @param signal The signal received from the other peer.
     */
    handleSignal(signal: any) {
        this.peer?.signal(signal);
    }

    /**
     * Send data to the other peer.
     * @param data The data to send to the peer.
     */
    send(data: any) {
        const payload = createPayload(PayloadType.MESSAGE, JSON.stringify(data), this.peerID, this.roomID);
        this.peer?.send(payload);
    }
}