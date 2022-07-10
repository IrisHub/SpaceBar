/* eslint-disable no-unused-vars */
import log from 'loglevel';

import SignalingClient from './signalingClient';
import { CommunicatorCallback } from './utils';

export enum CommunicatorChannel {
  PEER, // Peer => Other Peer
  SERVER, // Peer => Server => Other Peer
}

/**
 * Communicator is the API layer for peer to peer connection and
 * communication via WebRTC or WebSockets.
 */
export default class Communicator {
  // TODO(SHALIN): Deploy to Heroku to get something like wss://spacebar-ws-2.herokuapp.com/
  private static socket_url = 'localhost';

  private static socket_port = 3400;

  private signalingClient: SignalingClient;

  private roomID: string;

  /**
   * Initialize the Communicator to communicate with peers.
   * @param {string} roomID The room ID to join.
   * @param {boolean} debug Whether or not to enable debug logging.
   */
  constructor(roomID: string, debug = false) {
    log.setLevel(debug ? log.levels.DEBUG : log.levels.SILENT);

    this.roomID = roomID;
    this.signalingClient = new SignalingClient(
      Communicator.socket_url, Communicator.socket_port, this.roomID,
    );
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
     * @param {any} data The data to send to the other peer.
     * @param {CommunicatorChannel} channel The channel to send the data over.
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
     * Register a callback to be called when events are fired from either the
     * signaling server or the peer connection.
     * @param {string} event The event to listen for.
     * @param {CommunicatorCallback} callback The callback to call when the
     * event is fired.
     */
  on(event: string, callback: CommunicatorCallback) {
    this.signalingClient.setEventCallback(event, callback);
  }
}
