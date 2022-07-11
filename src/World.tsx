import { useEffect, useRef } from 'react';
import React from 'react';
import { useLocation } from 'react-router-dom';

import Communicator, { CommunicatorChannel } from './network/communicator';
import Display from './UI/Display/Display';
import Scene from './World/Scene/Scene';

function World() {
  const location = useLocation();
  const communicator = useRef<Communicator>();

  useEffect(() => {
    communicator.current = new Communicator(location.pathname);

    communicator.current.on('connect', () => {
      console.log('Peers are connected.');
    });

    communicator.current.on('message', (message) => {
      console.log('message', message);
    });

    communicator.current.on('disconnect', () => {
      console.log('disconnect');
    });

    communicator.current.on('error', () => {
      console.log('error');
    });
  }, [location.pathname]);

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = (event.currentTarget.elements[0] as HTMLInputElement).value;
    if (communicator.current && communicator.current.peerConnected) {
      // SEND FORM DATA TO THE OTHER PEER VIA THE SERVER
      communicator.current.send(data.toString(), CommunicatorChannel.PEER);
    }
  }

  return (
    <>
      <form onSubmit={(e) => handleSubmit(e)}>
        <textarea id="incoming"></textarea>
        <button type="submit">submit</button>
      </form>
      <Display />
      <Scene />
    </>
  );
}

export default World;
