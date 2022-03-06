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
<<<<<<< HEAD:src/Player/playerMovementControls.ts
    const onKeyDown = (event: { key: string, code: string }) => {
      console.log(event);
      let key = event.key;
      if (event.code == 'Space'){
        key = 'Space';
      }
      setDirection(pressedKey => ({
=======
    const onKeyDown = (event: { key: string }) => {
      setDirection((pressedKey) => ({
>>>>>>> 37bf1b9bc4ceb3a25486cfa34f8cab517b5e4315:src/Player/playerMovementControls.tsx
        ...pressedKey,
        [keyMap[key]]: true,
      }));
    };
<<<<<<< HEAD:src/Player/playerMovementControls.ts
    const onKeyUp = (event: { key: string, code:string }) => {
      let key = event.key;
      if (event.code == 'Space'){
        key = 'Space';
      }
      setDirection(pressedKey => ({
=======
    const onKeyUp = (event: { key: string }) => {
      setDirection((pressedKey) => ({
>>>>>>> 37bf1b9bc4ceb3a25486cfa34f8cab517b5e4315:src/Player/playerMovementControls.tsx
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
