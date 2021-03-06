import { useEffect, useState } from 'react';
// import PlayerCameraControls from './PlayerCameraControls';

/**
 * Handles keypresses, namely how to emit the appropriate translation
 * from keypresses into player directions, which are then fed to the main
 * Player.tsx file to handle the conversion from directions (booleans) to
 * Cannon.js movement vectors
 */
const PlayerMovementControls = () => {
  const [direction, setDirection] = useState({
    forward: false,
    backward: false,
    left: false,
    right: false,
    jump: false,
  });

  const keyMap: { [key: string]: string } = {
    w: 'forward',
    ArrowUp: 'forward',
    a: 'left',
    ArrowLeft: 'left',
    s: 'backward',
    ArrowDown: 'backward',
    d: 'right',
    ArrowRight: 'right',
    Space: 'jump',
  };

  useEffect(() => {
    const onKeyDown = (event: { key: string }) => {
      let key = event.key;
      if (event.key == ' ') {
        key = 'Space';
      }
      setDirection((pressedKey) => ({
        ...pressedKey,
        [keyMap[key]]: true,
      }));
    };
    const onKeyUp = (event: { key: string }) => {
      let key = event.key;
      if (event.key == ' ') {
        key = 'Space';
      }
      setDirection((pressedKey) => ({
        ...pressedKey,
        [keyMap[key]]: false,
      }));
    };
    document.addEventListener('keydown', onKeyDown);
    document.addEventListener('keyup', onKeyUp);

    return () => {
      document.removeEventListener('keydown', onKeyDown);
      document.removeEventListener('keyup', onKeyUp);
    };
  }, []);

  return direction;
};

export default PlayerMovementControls;
