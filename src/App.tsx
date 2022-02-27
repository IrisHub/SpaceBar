import React from 'react';
// import Scene from './Scene';
import { Canvas } from '@react-three/fiber';
import { Sky, PointerLockControls } from '@react-three/drei';
import { Physics } from '@react-three/cannon';
import { Player } from './player';
import { Floor } from './floor';

// import './App.css';

function App() {
  return (
    <Canvas camera={{ fov: 45 }}>
      <Sky sunPosition={[100, 20, 100]} />
      <Physics gravity={[0, -30, 0]}>
        <Player />
        <Floor />
      </Physics>
      {/* <Scene /> */}
      <PointerLockControls
        key={undefined}
        attach={undefined}
        attachArray={undefined}
        attachObject={undefined}
        args={undefined}
        // eslint-disable-next-line react/no-children-prop
        children={undefined}
        onUpdate={undefined}
        domElement={undefined}
        isLocked={undefined}
        minPolarAngle={undefined}
        maxPolarAngle={undefined}
        connect={undefined}
        disconnect={undefined}
        getDirection={undefined}
        moveForward={undefined}
        moveRight={undefined}
        lock={undefined}
        unlock={undefined}
        addEventListener={undefined}
        hasEventListener={undefined}
        removeEventListener={undefined}
        dispatchEvent={undefined}
      />
    </Canvas>
  );
}

export default App;
