import SimplePeer from 'simple-peer';
import { PayloadType, createPayload } from "./utils";

export type PeerCallback = (data: any) => void;

// Abstraction over simple peer that lets us pass messages without worrying too much about the 
// implementation details of the connection and communication process with the peer.
class PeerManager {
    private peer?: SimplePeer.Instance;

    isInitiator?: boolean;
    peerID?: string;
    roomID?: string;

    onSignal: PeerCallback;
    onConnect: PeerCallback;
    onData: PeerCallback;
    onError: PeerCallback;

    constructor(onSignal: PeerCallback, onConnect: PeerCallback, onData: PeerCallback, onError: PeerCallback) {
        this.onSignal = onSignal;
        this.onConnect = onConnect;
        this.onData = onData;
        this.onError = onError;
    }

    createPeer() {
        const SimplePeer = (window as any)["SimplePeer"]; // Grab the SimplePeer class from the window object.
        this.peer = new SimplePeer({
            initiator: this.isInitiator,
            trickle: true,
        })
        this._handlePeerCallbacks();
    }

    _handlePeerCallbacks() {
        this.peer?.on('signal', (data) => this.onSignal(data));
        this.peer?.on('connect', () => this.onConnect(null));
        this.peer?.on('data', (data) => this.onData(data));
        this.peer?.on('error', (err) => this.onError(err));
    }

    // Callable functions for interacting with the peer instance.
    signal(data: any) {
        this.peer?.signal(data);
    }

    send(data: any) {
        const payload = createPayload(PayloadType.MESSAGE, data, this.peerID, this.roomID);
        this.peer?.send(payload);
    }
}

export default PeerManager;