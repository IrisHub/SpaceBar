import { useEffect, useState } from 'react';

export const playerMovementControls = () => {
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
      setDirection((pressedKey) => ({
        ...pressedKey,
        [keyMap[event.key]]: true,
      }));

      //TODO: explore emitting player coordinates here by accessing the camera position
    };
    const onKeyUp = (event: { key: string }) => {
      setDirection((pressedKey) => ({
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
