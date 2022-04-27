// import SimplePeer from 'simple-peer';
import { useEffect } from 'react'
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

  useEffect(()=>{
    // The intiator peer is the one with #1 in the URL
    new SimpleSignaler(location.hash === "#1", socket_url, socket_port);
  }, [])


  
    return (
      <>
            {/* <PeerForm signaler={signaler} /> */}
            <pre id="outgoing"></pre> 
      </>
    );
}

export default Peer;