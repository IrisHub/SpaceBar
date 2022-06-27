import { Dims } from './constants';
import {
  ceilPow2,
  gaussianBM,
  initArray2D,
  meanSmoothing,
  modulo,
} from './utils';

const initCornersArray2D = (numSegments: number, amplitude: number) => {
  var array2D = initArray2D(numSegments);
  array2D[0][0] = gaussianBM(0, amplitude);
  array2D[0][numSegments - 1] = gaussianBM(0, amplitude);
  array2D[numSegments - 1][numSegments - 1] = gaussianBM(0, amplitude);
  array2D[numSegments - 1][0] = gaussianBM(0, amplitude);

  return array2D;
};

const terrainMapGenerator = (
  amplitude: number,
  ampDecay: number,
): Array<Array<number>> => {
  const numSegments = ceilPow2(Math.max(Dims.floorX, Dims.floorZ)) + 1;

  var array2D: Array<Array<number>> = initCornersArray2D(
    numSegments,
    amplitude,
  );
  var stepSize = numSegments - 1;
  var halfStep = stepSize / 2;
  var mean = 0;

  const diamond = (): void => {
    for (var x = 0; x < numSegments - 1; x += stepSize) {
      for (var y = 0; y < numSegments - 1; y += stepSize) {
        let avg =
          0.25 *
          (array2D[x][y] +
            array2D[x][y + stepSize] +
            array2D[x + stepSize][y] +
            array2D[x + stepSize][y + stepSize]);
        const displacement = avg + gaussianBM(0, amplitude);
        mean += displacement;
        array2D[x + halfStep][y + halfStep] = displacement;
      }
    }
  };

  const square = (): void => {
    for (var x = 0; x < numSegments; x += halfStep) {
      for (var y = (x + halfStep) % stepSize; y < numSegments; y += stepSize) {
        const leftNode = array2D[modulo(x - halfStep, numSegments - 1)][y];
        const rightNode = array2D[modulo(x + halfStep, numSegments - 1)][y];
        const upNode = array2D[x][modulo(y + halfStep, numSegments - 1)];
        const downNode = array2D[x][modulo(y - halfStep, numSegments - 1)];
        const avg = 0.25 * (leftNode + rightNode + upNode + downNode);
        const displacement = avg + gaussianBM(0, amplitude);
        mean += displacement;
        array2D[x][y] = displacement;
      }
    }
  };
  // TODO: weird wall in +Z direction?
  // TODO: weird seam along the line from

  while (stepSize > 1) {
    diamond();
    square();
    amplitude *= Math.pow(4, -ampDecay);
    stepSize = Math.floor(stepSize / 2);
    halfStep = stepSize / 2;
  }
  mean /= Dims.floorX * Dims.floorZ;
  console.log(mean);

  for (var i = 0; i < array2D.length; i++) {
    for (var j = 0; j < array2D.length; j++) {
      array2D[i][j] -= mean;
    }
  }
  meanSmoothing(array2D);
  return array2D;
};

export { terrainMapGenerator };
