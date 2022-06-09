// import SimplePeer from 'simple-peer';
import { useEffect } from 'react'
import { useLocation } from 'react-router-dom';
import { PeerForm } from './PeerForm';
import Communicator from './network/communicator'


function Peer() {
  const location = useLocation();

  useEffect(()=>{
    // The intiator peer is the one with #1 in the URL
    new Communicator();
  }, [])


  
    return (
      <>
            {/* <PeerForm signaler={signaler} /> */}
            <pre id="outgoing"></pre> 
      </>
    );
}

export default Peer;