import { useRef, useEffect } from 'react'
import { useLocation } from 'react-router-dom';
import Communicator, { CommunicatorChannel } from './network/communicator'

function Peer() {
  const location = useLocation();
  const communicator = useRef<Communicator>();

  useEffect(() => {
    communicator.current = new Communicator(location.pathname);

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
  }, [location.pathname]);
  
  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = (event.currentTarget.elements[0] as HTMLInputElement).value;
    if (communicator.current && communicator.current.peerConnected()) {
      communicator.current.send(data.toString(), CommunicatorChannel.SERVER);
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