/**
 * Converts a shorthand file path to a full path for an S3 bucket.
 * @param path
 * @param fileclass
 * @returns string
 */
export function resolveS3Path(path: string, fileclass: string) {
  const s3RootPath = 'https://3dspatialaudio.s3.us-west-1.amazonaws.com/';
  switch (fileclass) {
    case 'texture':
      return s3RootPath + 'textures/' + path;
    case 'model':
      return s3RootPath + 'models/' + path;
    default:
      throw new Error('fileclass must be one of "texture", "model".');
  }
}
