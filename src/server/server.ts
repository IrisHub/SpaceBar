import fs from 'fs-extra';
import * as path from 'path';

/**
 * writeToFS is a helper function that writes a message to a fileNamePath.
 * @param fileNamePath
 * @param message
 */
export async function writeToFS(fileNamePath: string, message: string) {
  if (message.length > 0) {
    fs.appendFile(fileNamePath, message + '\n', (err) => {
      if (err) {
        console.error('Error appending to file' + err);
      }
    });
  } else {
    console.error('Message to write to fs is empty ');
  }
}

/**
 *helper to write coordinates to a test file
 */
export async function writeCoordinatesToFS(coords: Array<number>) {
  const fileNamePath = path.join(__dirname, '../../files', 'chats', 'test');
  const packagedCoords = coords.toString();
  writeToFS(fileNamePath, packagedCoords);
}
