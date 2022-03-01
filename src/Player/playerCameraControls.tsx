import { PointerLockControls } from '@react-three/drei';
import { useThree } from '@react-three/fiber';
import React, { useEffect } from 'react';

export default function PlayerCameraControls() {
  const { controls } = useThree();

  useEffect(() => {
    if (controls && controls.current) {
      document.addEventListener('click', () => {
        controls?.current?.lock();
      });
    }
  }, [controls]);


  return (
    <PointerLockControls
      ref = {controls}
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
  );
}

