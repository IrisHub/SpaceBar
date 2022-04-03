import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import Peer from './Peer';


function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Peer />
      </BrowserRouter>
    </div>
  );
}

export default App;
