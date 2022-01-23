import { PALETTE } from "../../constants/palette";

export function randomNumberInRange(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function randomArrayIndex<T>(array: T[]) {
  const index = randomNumberInRange(0, array.length);
  return array[index];
}

export function randomColor() {
  return randomArrayIndex(PALETTE);
}

export function randomColorIndex() {
  return randomNumberInRange(0, PALETTE.length);
}
