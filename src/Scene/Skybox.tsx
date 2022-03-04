import { useThree } from '@react-three/fiber';
import { CubeTextureLoader } from 'three';

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
  const sides = ['negz', 'posz', 'posy', 'negy', 'posx', 'negx'];
  const filePath = 'https://3dspatialaudio-textures.s3.us-west-2.amazonaws.com/';
  const extension = '.jpg'; 
  const pathStrings = sides.map(side => {
    return filePath + side + extension;
  });
  const texture = loader.load(pathStrings);
  scene.background = texture;
  
  return (null);
}