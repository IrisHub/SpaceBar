import { PointerLockControls } from '@react-three/drei';
import { useThree } from '@react-three/fiber';
import React, { useEffect } from 'react';

export default function PlayerCameraControls() {
  /**
   * Defines player camera controls, and allows for more custom manipulation
   * of the default Three/drei PointerLockControls component.
   */
  const { controls } = useThree();

  useEffect(() => {
    if (controls && controls.current) {
      document.addEventListener('click', () => {
        controls?.current?.lock();
      });
    }
  }, [controls]);

  // @ts-expect-error
  // Supressing known typing error with Drei: https://github.com/pmndrs/drei/issues/687
  return <PointerLockControls ref={controls} />;
}
