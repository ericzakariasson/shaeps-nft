import { COLORS } from "../../constants/colors";

export function randomNumberInRange(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function randomArrayIndex<T>(array: T[]) {
  const index = randomNumberInRange(0, array.length);
  return array[index];
}

export function randomColor() {
  return randomArrayIndex(COLORS);
}

export function randomColorIndex() {
  return randomNumberInRange(0, COLORS.length);
}
