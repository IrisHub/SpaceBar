/** File utils */

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
  var maxLog = Math.ceil(Math.log2(n));
  return Math.pow(2, maxLog);
};

/**
 * Uses the Box-Muller transform to generate Gaussian samples
 * @param mean 
 * @param variance 
 * @returns number
 */
export const gaussianBM = (mean: number = 0, variance: number = 1) => {
  var u1 = 0, u2 = 0;
  while (u1 === 0) u1 = Math.random();
  while (u2 === 0) u2 = Math.random();
  var R = Math.sqrt(-2 * Math.log(u1));
  var theta = 2 * Math.PI * u2;
  var stdNormal = R * Math.cos(theta);
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
 * Each element B(x, y) in the new array is the average of A(x, y)
 * in the original array along with its 8 neighboring cells.
 * This function wraps around to the opposite side of the matrix for
 * border and corner cases.
 * @param array2D 
 * @returns Array<Array<number>>
 */
export const meanSmoothing = (array2D: Array<Array<number>>) => {
  var len = array2D.length;
  var smoothedHeightMap = initArray2D(len);
  for (var i = 0; i < array2D.length; i++) {
    for (var j = 0; j < array2D.length; j++){
      var topLeft = array2D[modulo(i - 1, len)][modulo(j - 1, len)];
      var topMid = array2D[i][modulo(j - 1, len)];
      var topRight = array2D[modulo(i + 1, len)][modulo(j - 1, len)];
      var midLeft = array2D[modulo(i - 1, len)][j];
      var midMid = array2D[i][j];
      var midRight = array2D[modulo(i + 1, len)][j];
      var botLeft = array2D[modulo(i - 1, len)][modulo(j + 1, len)];
      var botMid = array2D[i][modulo(j + 1, len)];
      var botRight = array2D[modulo(i + 1, len)][modulo(j + 1, len)];
      smoothedHeightMap[i][j] = (topLeft + topMid + topRight + midLeft + midRight + midMid + botLeft + botMid + botRight) / 9.0;
    }
  }
  return smoothedHeightMap;
};

