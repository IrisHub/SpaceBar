import {
  PointerLockControls,
  PointerLockControlsProps,
} from '@react-three/drei';
import React, { useEffect, useRef } from 'react';

export default function PlayerCameraControls() {
  /**
   * Defines player camera controls, and allows for more custom manipulation
   * of the default Three/drei PointerLockControls component.
   */
  let controlsRef = useRef<PointerLockControlsProps>(null);

  useEffect(() => {
    document.addEventListener('click', () => {
      controlsRef?.current?.lock?.();
    });
  }, [controlsRef]);

  // @ts-expect-error
  // Supressing known typing error with Drei: https://github.com/pmndrs/drei/issues/687
  return <PointerLockControls ref={controlsRef} />;
}
