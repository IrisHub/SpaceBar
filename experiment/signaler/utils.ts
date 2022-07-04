export enum PayloadType {
    JOIN_ROOM,
    SIGNAL,
    CANDIDATE,
    DATA,
    HANDSHAKE,
    NEW_PEER,
}

export interface Payload {
    id?: string;
    type: string;
    data: string;
    roomID?: string;
}

/**
 * Creates a payload object to send to the signaling server.
 * @param type PayloadType, which gives the payload a type. 
 * @param data The data to be sent, which can be any type since it will be serialized to JSON.
 * @returns A serialized JSON string.
 */
 export function createPayload(type: PayloadType, data: any, id?: string, roomID?: string) {
    const payload: Payload = {
        id: id,
        type: PayloadType[type],
        data: JSON.stringify(data),
        roomID: roomID,
    };
    return JSON.stringify(payload);
}

export function parse(byteArray: any)  {
    return JSON.parse(byteArray.toString());
}