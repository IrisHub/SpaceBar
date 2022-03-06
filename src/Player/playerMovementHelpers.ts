import { PlayerPosition } from '../allTypes';
/**
 * serialize is a helper function that is a light wrapper around stringifying a JSON object.
 * @param data 
 * @returns string
 */
export function serialize(data:PlayerPosition):string {
  return JSON.stringify(data);
}

/**
 * unserialize is a helper function that is a light wrapper around parsing a JSON string.
 * Returns undefined if error occured.
 * @param data 
 * @returns string
 */
export function unserialize(data:PlayerPosition) {
  try {
    return JSON.parse(data.toString());
  } catch (e) {
    return undefined;
  }
}

/**
 * roundEntriesInVector is a helper function that rounds a vector
 * to a number of places.
 * @param vector 
 * @param numToRound 
 * @returns vector
 */
export function roundEntriesInVector(vector:PlayerPosition, numToRound:number){

  for (let [key, value] of Object.entries(vector)) {
    vector[key as keyof PlayerPosition] = parseFloat(value.toFixed(numToRound));
  }
  return vector;
}