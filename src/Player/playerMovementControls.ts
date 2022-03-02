import { useEffect, useState } from 'react';


export const playerMovementControls = () => {
  /**
   * Handles keypresses, namely how to emit the appropriate translation
   * from keypresses into player directions, which are then fed to the main
   * Player.tsx file to handle the conversio from directions (booleans) to 
   * Cannon.js movement vectors
   */
  const [direction, setDirection] = useState({
    forward: false,
    backward: false,
    left: false,
    right: false,
  });
  
  const keyMap: { [key: string]: string } = {
    w: 'forward',
    ArrowUp: 'forward',
    s: 'backward',
    ArrowDown: 'backward',
    a: 'left',
    ArrowLeft: 'left',
    d: 'right',
    ArrowRight: 'right',
  };

  useEffect(() => {
    const onKeyDown = (event: { key: string }) => {
      setDirection(pressedKey => ({
        ...pressedKey,
        [keyMap[event.key]]: true,
      }));
    };
    const onKeyUp = (event: { key: string }) => {
      setDirection(pressedKey => ({
        ...pressedKey,
        [keyMap[event.key]]: false,
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
