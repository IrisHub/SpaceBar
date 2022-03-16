import { PlayerPosition, PlayerVelocity } from '../allTypes';
/**
 * serialize is a helper function that is a light wrapper around stringifying a JSON object.
 * @param data 
 * @returns string
 */
export function serialize(data:PlayerPosition):string {
  return JSON.stringify(data);
}

/**
 * deserialize is a helper function that is a light wrapper around parsing a JSON string.
 * Returns undefined if error occured.
 * @param data 
 * @returns string
 */
export function deserialize(data:PlayerPosition) {
  try {
    return JSON.parse(data.toString());
  } catch (e) {
    return undefined;
  }
}

/**
 * round is a simple helper funciton that rounds a float 
 * to a number of places.
 * @param float 
 * @param numToRound 
 * @returns rounded number
 */
export function round(float:Number, numToRound:number):number{
  return parseFloat(float.toFixed(numToRound));
}
/**
 * roundEntriesInVector is a helper function that rounds a vector
 * to a number of places.
 * @param vector 
 * @param numToRound 
 * @returns vector
 */
export function roundEntriesInVector(vector:PlayerPosition | PlayerVelocity, numToRound:number){

  for (let [key, value] of Object.entries(vector)) {
    vector[key as keyof PlayerPosition] = round(value, numToRound);
  }
  return vector;
}