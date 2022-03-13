import { useThree } from '@react-three/fiber';
import { CubeTextureLoader } from 'three';
import { getS3Path } from '../utils';

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
    'textures/negz.jpg',
    'textures/posz.jpg', 
    'textures/posy.jpg', 
    'textures/negy.jpg', 
    'textures/posx.jpg', 
    'textures/negx.jpg',
  ];
  const pathStrings = sides.map(side => {
    return getS3Path(side);
  });
  const texture = loader.load(pathStrings);
  scene.background = texture;
  
  return (null);
}