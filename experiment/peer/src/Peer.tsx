import SimplePeer from 'simple-peer';
import { useLocation } from 'react-router-dom';
import { useEffect } from "react";
import { PeerForm } from './PeerForm';
import signalhubws from 'signalhubws';

function Peer() {
    const location = useLocation();
    const peer = new SimplePeer({
        initiator: location.hash === '#1', // The intiator peer is the one with #1 in the URL
        trickle: true,
    });
    
    const hub = signalhubws("", ["wss://spacebar-ws-2.herokuapp.com/"]);

    useEffect(() => {
        peer.on('signal', (data) => {
            // console.log('Received signal from peer:', JSON.stringify(data));
            // () => console.log("broadcasted")
            hub.broadcast("firstPeer", JSON.stringify(data));
        });
    });
  
    return (
      <>
            <PeerForm peer={peer} />
            <pre id="outgoing"></pre> 
      </>
    );
}

export default Peer;