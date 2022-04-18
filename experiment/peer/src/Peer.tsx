// import SimplePeer from 'simple-peer';
import { useLocation } from 'react-router-dom';
import { PeerForm } from './PeerForm';
import SimpleSignaler from './network/simple-signaler'

// Create a test websocket connection to our node server in ../signaler/app.ts.
// Eventually we want to use a real signaling server -- something like 
// wss://spacebar-ws-2.herokuapp.com/
const socket_url = "localhost";
const socket_port = 3400;

function Peer() {
  const location = useLocation();
  
    const SimplePeer = (window as any)["SimplePeer"]; // Grab the SimplePeer class from the window object.
    const peer = new SimplePeer({
        initiator: location.hash === '#1', // The intiator peer is the one with #1 in the URL
        trickle: true,
    });

    const signaler = new SimpleSignaler(peer, socket_url, socket_port);
    signaler.createPeerConnection();
  
    return (
      <>
            <PeerForm signaler={signaler} />
            <pre id="outgoing"></pre> 
      </>
    );
}

export default Peer;