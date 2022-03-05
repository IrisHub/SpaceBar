import { PlayerPosition } from '../allTypes';

export function serialize(data:PlayerPosition) {
  return JSON.stringify(data);
}

export function unserialize(data:PlayerPosition) {
  try {
    return JSON.parse(data.toString());
  } catch (e) {
    return undefined;
  }
}