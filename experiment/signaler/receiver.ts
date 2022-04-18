
// TODO(SHALIN): Move to some kind of utils file.
function parse(byteArray: ws.RawData)  {
    return JSON.parse(byteArray.toString());
}

function handleReceive(message: ws.RawData) {
    const parsedMessage = parse(message);
    const [type, data] = [parsedMessage.type, parsedMessage.data];

    console.log(`Received message of type: ${parsedMessage.type}`);

    // TODO(SHALIN): Pull the `type`s from a shared types file instead of hardcoding the strings.
    switch (type) {
        case "NEW_PEER":
            handleNewPeer(data);
            break
        case "SIGNAL":
            handleSendSignal(data);
            break
        case "MESSAGE":
            handleMessage(data);
            break
        case "JOIN":
            handleJoin(data);
            break
        case "HANGUP":
            handleHangup(data);
            break
    }
}

function handleNewPeer(message: ws.RawData) {
    console.log("handleNewPeer", parse(message));
}

function handleSendSignal(message: ws.RawData) { 
    console.log("handleSendSignal", parse(message));
}

function handleMessage(message: ws.RawData) {
    console.log("handleMessage", parse(message));
}

function handleJoin(message: ws.RawData) {
    console.log("handleCreateOrJoin", parse(message));
}

function handleHangup(message: ws.RawData) {
    console.log("handleHangup", parse(message));
}

function handleDisconnect(message: ws.RawData) {
    console.log("handleDisconnect", parse(message));
}

export default handleReceive;