import { createPayload, PayloadType, PeerCallback } from './utils';

/**
 * PeerManager is the abstraction layer over the SimplePeer library,
 * managing the connection and communication process between two (or more)
 * peers.
 */
export default class PeerManager {
  private peer?: any;

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

  /**
   * Initialize the PeerManager class.
   * @param {PeerCallback} onSignal Callback function when a signal is received.
   * @param {PeerCallback} onConnect Callback function when a connection is
   * established.
   * @param {PeerCallback} onData Callback function when data is received.
   * @param {PeerCallback} onClose Callback function when the connection
   * is closed.
   * @param {PeerCallback} onError Callback function when an error occurs.
   */
  constructor(
    onSignal: PeerCallback,
    onConnect: PeerCallback,
    onData: PeerCallback,
    onClose: PeerCallback,
    onError: PeerCallback,
  ) {
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
    // Grab the SimplePeer class from the window object.
    const SimplePeer = (window as any).SimplePeer;
    this.peer = new SimplePeer({
      initiator: this.isInitiator,
      trickle: true,
    });
    this._handlePeerCallbacks();
  }

  /**
   * Handle the callbacks from the SimplePeer listener functions.
   */
  _handlePeerCallbacks() {
    this.peer?.on('signal', (data: any) => this.onSignal(data));
    this.peer?.on('connect', () => this.onConnect(null));
    this.peer?.on('data', (data: any) => this.onData(data));
    this.peer?.on('close', () => this.onClose(null));
    this.peer?.on('error', (err: Error) => this.onError(err));
  }

  /**
   * Handle a signal received from the other peer.
   * @param {any} signal The signal received from the other peer.
   */
  handleSignal(signal: any) {
    this.peer?.signal(signal);
  }

  /**
   * Send data to the other peer.
   * @param {any} data The data to send to the peer.
   */
  send(data: any) {
    const payload = createPayload(
      PayloadType.MESSAGE,
      JSON.stringify(data),
      this.peerID,
      this.roomID,
    );
    this.peer?.send(payload);
  }
}
