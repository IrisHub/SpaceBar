import React from 'react';
import Scene from './Scene/Scene';
import VideoPlayer from './Video/video';

function App() {
  return (
    <>
      <VideoPlayer height={115} width={150} />
      <Scene />
    </>
  );
}

export default App;
