import React from 'react';
import { BrowserRouter } from 'react-router-dom';

import World from './World';
const App = () => {
  return (
    <BrowserRouter>
      <World />
    </BrowserRouter>
  );
};

export default App;
