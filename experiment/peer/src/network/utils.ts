
export type PeerCallback = (data: any) => void;
export type CommunicatorCallback = (data: any) => void;

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
 * @param roomID Optional string containing the id of the room the peer intends to join or is a part of. 
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

/**
 * Saves an object to local storage for persistence across browser sessions.
 * @param key The `string` used to save the data to storage.
 * @param value The data, of type `any`, to be serialized and saved.
 */
export function save(key: string, value: any) {
    localStorage.setItem(key, JSON.stringify(value));
}

/**
 * Retreives an object from local storage that was saved from this or a previous browser session.
 * @param key The `string` used to retreive the saved value from storage. 
 * @returns The deserialized data object that was retreived from storage, or empty dictionary if object was not found.
 */
export function load(key: string) {
    return JSON.parse(localStorage.getItem(key) ?? "{}");
}