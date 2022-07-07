import { useRef } from 'react'
import { useLocation } from 'react-router-dom';
import Communicator, { CommunicatorChannel } from './network/communicator'

function Peer() {
  const location = useLocation();
  const communicator = useRef(new Communicator(location.pathname));

  communicator.current.on('connect', (data) => {
    console.log("Peers are connected.");
  });

  communicator.current.on('message', (message) => {
    console.log('message', message);
  });

  communicator.current.on('disconnect', (data) => {
    console.log('disconnect');
  });

  communicator.current.on('error', (error) => {
    console.log('error');
  });

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = (event.currentTarget.elements[0] as HTMLInputElement).value;
    if (communicator && communicator.current.peerConnected()) {
      communicator.current.send(data.toString());
    }
  } 

  return (
    <form onSubmit={(e)=>handleSubmit(e)}>
      <textarea id="incoming"></textarea>
      <button type="submit">submit</button>
  </form>
  );

}

export default Peer;