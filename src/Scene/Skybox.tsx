import { useThree } from '@react-three/fiber';
import { CubeTextureLoader } from 'three';
import { SkyboxImages } from '../constants';

export default function Skybox() {
  /**
   * Applies a textured skybox.
   * Images licenced under Creative Commons Attribution 3.0 Unported License.
   * https://creativecommons.org/licenses/by/3.0/
   * https://www.humus.name/index.php?page=Textures&ID=126
   */
  const { scene } = useThree();
  const loader = new CubeTextureLoader();
  loader.setCrossOrigin('anonymous');
  const sides = [
    SkyboxImages.negz,
    SkyboxImages.posz,
    SkyboxImages.posy,
    SkyboxImages.negy,
    SkyboxImages.posx,
    SkyboxImages.negx,
  ];
  const texture = loader.load(sides);
  scene.background = texture;

  return null;
}
