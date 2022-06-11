import { Vector3 } from 'three';
import { SimpleVector3 } from '../types';

/**
 * serialize is a helper function that is a light wrapper around stringifying a JSON object.
 * @param data
 * @returns string
 */
export function serialize(data: SimpleVector3): string | undefined {
  try {
    return JSON.stringify(data);
  } catch (e) {
    return undefined;
  }
}

/**
 * deserialize is a helper function that is a light wrapper around parsing a JSON string.
 * Returns undefined if error occured.
 * @param data
 * @returns string
 */
export function deserialize(data: SimpleVector3): string | undefined {
  try {
    return JSON.parse(data.toString());
  } catch (e) {
    return undefined;
  }
}

/**
 * round is a simple helper function that rounds a float
 * to a number of places.
 * @param float
 * @param numToRound
 * @returns rounded number
 */
export function round(float: Number, numToRound: number): number {
  return parseFloat(float.toFixed(numToRound));
}
/**
 * roundEntriesInVector is a helper function that rounds a vector
 * to a number of places.
 * @param vector
 * @param numToRound
 * @returns vector
 */
export function roundEntriesInVector3(vector: Vector3, numToRound: number) {
  for (const [key, value] of Object.entries(vector)) {
    vector[key as keyof SimpleVector3] = round(value, numToRound);
  }
  return vector as Vector3;
}
