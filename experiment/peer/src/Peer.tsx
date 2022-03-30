import SimplePeer from 'simple-peer';
import { useLocation } from 'react-router-dom';
import { useEffect } from "react";
import { PeerForm } from './PeerForm';

function Peer() {
    const location = useLocation();
    const peer = new SimplePeer({
        initiator: location.hash === '#1', // The intiator peer is the one with #1 in the URL
        trickle: true,
    });

    // TODO(SHALIN): Move to utils.ts
    const useMountEffect = (func: () => void) => useEffect(func ,[]);

    // Create a test websocket connection to our node server in ../signaler/app.ts.
    // Eventually we want to use a real signaling server -- something like 
    // wss://spacebar-ws-2.herokuapp.com/
    const ws = new WebSocket('ws://localhost:8080/');

    // We will only get a signal if the peer is the initiator.
    // When the websocket connection is open, send the signal peer's signal our 
    // node server.
    useMountEffect(() => {
        peer.on('signal', (data) => {
            console.log('Received signal from peer:', JSON.stringify(data));
            ws.onopen = function (_) {
                ws.send(JSON.stringify(data));
            };
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