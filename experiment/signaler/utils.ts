export enum PayloadType {
    // Sent from PEER -> SIGNALING SERVER to join a particular room. 
    // Also sent from SIGNALING SERVER -> PEER with unique peer id and other metadata.
   JOIN,

   // Sent from SIGNALING SERVER -> PEER to initiate the ICE exchange.
   INITIATE,

   // Sent from PEER -> SIGNALING SERVER and from SIGNALING SERVER -> OTHER PEER
   // as part of the exchange process needed to establish a WebRTC connection between
   // PEER and OTHER PEER.
   SIGNAL,

   // Generic payload type to send messages from PEER -> ALL OTHER PEERS in the room via
   // the signaling server instead of over a direct P2P connection.
   MESSAGE,
}

export interface Payload {
    type: string;
    data: string;
    peerID?: string;
    roomID?: string;
}

/**
 * Creates a payload object to send to the signaling server.
 * @param type PayloadType, which gives the payload a type. 
 * @param data The data, of type `any`, to be sent.
 * @param peerID Optional string containing the unique id of the peer.
 * @param roomID Optional string containing the id of the room the peer is a part of or intends to join. 
 * @returns A serialized JSON string.
 */
 export function createPayload(type: PayloadType, data: any, peerID?: string, roomID?: string) {
    const payload: Payload = {
        type: PayloadType[type],
        data: JSON.stringify(data),
        peerID: peerID,
        roomID: roomID,
    };
    return JSON.stringify(payload);
}

export function parse(byteArray: any)  {
    return JSON.parse(byteArray.toString());
}