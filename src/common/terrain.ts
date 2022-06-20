import { Dims } from './constants';
import { ceilPow2, gaussianBM, initArray2D, meanSmoothing, modulo } from './utils';  

const initCornersArray2D = (numSegments: number, amplitude: number) => {
  var array2D = initArray2D(numSegments);
  array2D[0][numSegments - 1] = gaussianBM(-0.5, amplitude);
  array2D[0][0] = gaussianBM(-0.5, amplitude);
  array2D[numSegments - 1][numSegments - 1] = gaussianBM(-0.5, amplitude);
  array2D[numSegments - 1][0] = gaussianBM(-0.5, amplitude);

  return array2D;
};

const terrainMapGenerator = (amplitude: number, ampDecay: number): Array<Array<number>> => {
  const numSegments = ceilPow2(Math.max(Dims.floorX, Dims.floorZ)) + 1;
  
  var array2D: Array<Array<number>> = initCornersArray2D(numSegments, amplitude);
  var stepSize = numSegments - 1;
  var halfStep = stepSize / 2;

  const diamond = (): void => {
    for (var x = 0; x < numSegments - 1; x += stepSize) {
      for (var y = 0; y < numSegments - 1; y += stepSize) {
        let avg = 0.25 * (
          array2D[x][y]
          + array2D[x][y + stepSize]
          + array2D[x + stepSize][y]
          + array2D[x + stepSize][y + stepSize]
        );
        array2D[x + halfStep][y + halfStep] = avg + gaussianBM(-0.5, amplitude);
      }
    }
  };

  const square = (): void => {
    for (var x = 0; x < numSegments; x += halfStep) {
      for (var y = (x + halfStep) % stepSize; y < numSegments; y += stepSize ) {
        let leftNode = array2D[modulo(x - halfStep, numSegments - 1)][y];
        let rightNode = array2D[modulo(x + halfStep, numSegments - 1)][y];
        let upNode = array2D[x][modulo(y + halfStep, numSegments - 1)];
        let downNode = array2D[x][modulo(y - halfStep, numSegments - 1)];
        let avg = 0.25 * ( leftNode + rightNode + upNode + downNode);
        array2D[x][y] = avg + gaussianBM(-0.5, amplitude);
      }
    }
  };

  while (stepSize > 1) {
    console.log(amplitude);
    diamond();
    square();
    amplitude *= Math.pow(4, -ampDecay);
    stepSize = Math.floor(stepSize / 2);
    halfStep = stepSize / 2;
  }
  return meanSmoothing(array2D);
};

export { terrainMapGenerator };