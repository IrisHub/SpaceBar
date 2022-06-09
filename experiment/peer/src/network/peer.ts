import SimplePeer from 'simple-peer';

// Abstraction over simple peer that lets us pass messages without worrying too much about the 
// implementation details of the connection and communication process with the peer.
class Peer {
    private peer: SimplePeer.Instance;
    id?: string;

    constructor(initiator: boolean) {
        this.peer = new SimplePeer({
            initiator: initiator,
            trickle: true,
        })
    }
}

export default Peer;