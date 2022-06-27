/** File utils */

// import { Dims } from "./constants";

/**
 * Converts a shorthand file path to a full path for an S3 bucket.
 * @param path
 * @param fileclass
 * @returns string
 */
export const resolveS3Path = (path: string, fileclass: string) => {
  const s3RootPath = 'https://3dspatialaudio.s3.us-west-1.amazonaws.com/';
  switch (fileclass) {
    case 'texture':
      return s3RootPath + 'textures/' + path;
    case 'model':
      return s3RootPath + 'models/' + path;
    default:
      throw new Error('fileclass must be one of "texture", "model".');
  }
};

// export const savePNG = (array2D: Array<Array<number>>) => {
//   var canvas = document.createElement('canvas');
//   var context = canvas.getContext('2d');
//   canvas.width = array2D[0].length;
//   canvas.height = array2D.length;
//   var imageData = context?.createImageData(canvas.width, canvas.height);
//   var data = imageData?.data;
//   for (var row = 0; row < canvas.height; row++) {
//     for (var col = 0; col < canvas.width; col++) {
//       var i = row * canvas.width + col;
//       var idx = i * 4;
//       data?[idx] = data[idx+1] = data[idx + 2] = Math.round(255)

//     }
//   }
//   return canvas.toDataURL('image/png');

// };

/** Math utils */

export const modulo = (val: number, n: number) => {
  return ((val % n) + n) % n;
};

/**
 * Returns the smallest power of 2 greater than or equal to n
 * @param n
 * @returns number
 */
export const ceilPow2 = (n: number) => {
  const ceilLog = Math.ceil(Math.log2(n));
  return Math.pow(2, ceilLog);
};

/**
 * Uses the Box-Muller transform to generate Gaussian samples
 * @param mean
 * @param variance
 * @returns number
 */
export const gaussianBM = (mean: number = 0, variance: number = 1) => {
  var u1 = 0,
    u2 = 0;
  // Math.random() returns a value in [0, 1) but the B-M transform requires values in (0, 1)
  // Need to make sure neither value is 0
  while (u1 === 0) u1 = Math.random();
  while (u2 === 0) u2 = Math.random();
  const R = Math.sqrt(-2 * Math.log(u1));
  const theta = 2 * Math.PI * u2;
  const stdNormal = R * Math.cos(theta);
  return (stdNormal + mean) * variance;
};

/**
 * Initializes an empty 2-D array
 * @param size
 * @returns
 */
export const initArray2D = (size: number) => {
  var array2D: Array<Array<number>> = new Array(size);
  for (var i = 0; i < size; i++) {
    array2D[i] = new Array(size);
  }
  return array2D;
};

/**
 * Passes a radius 1 box blur (3x3 kernel) over an array
 * in-place using the fact that the box blur is a separable
 * filter by passing a moving average filter horizontally
 * then vertically. This construction has O(1) memory and
 * O(N) time where N is the number of entries in the array
 * @param array2D
 * @returns Array<Array<number>>
 */
export const meanSmoothing = (array2D: Array<Array<number>>) => {
  const wrapArray = (idx: number) => {
    return modulo(idx, array2D.length);
  };
  var left, mid, right, top, bot;

  // Apply 1-D moving average to each row
  for (var i = 0; i < array2D.length; i++) {
    left = 0;
    mid = array2D[i][wrapArray(-1)] / 3;
    right = array2D[i][0] / 3;
    for (var j = 0; j < array2D.length; j++) {
      left = mid;
      mid = right;
      right = array2D[i][wrapArray(j + 1)] / 3;
      array2D[i][j] = left + mid + right;
    }
  }

  // Apply 1-D moving average to each column
  for (j = 0; j < array2D.length; j++) {
    top = 0;
    mid = array2D[wrapArray(-1)][j] / 3;
    bot = array2D[0][j] / 3;
    for (i = 0; i < array2D.length; i++) {
      top = mid;
      mid = bot;
      bot = array2D[wrapArray(i + 1)][j] / 3;
      array2D[i][j] = top + mid + bot;
    }
  }
};
