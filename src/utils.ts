/**
 * getS3Path converts a shorthand file path to a full path to an s3 bucket.
 * @param path
 * @returns string
 */
export function getS3Path(path: string) {
  const s3RootPath = 'https://3dspatialaudio.s3.us-west-1.amazonaws.com/';
  return s3RootPath + path;
}
