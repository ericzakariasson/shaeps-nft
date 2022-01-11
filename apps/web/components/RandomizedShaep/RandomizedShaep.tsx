import { useInterval } from "@chakra-ui/react";
import { useState } from "react";
import { Shaep, SHAEP_PART_COUNT } from "../Shaep";
import { randomColor, randomColorIndex } from "./helpers";

type RandomizedShaepProps = {
  randomizedPartCount?: number;
  interval?: number;
};

export function RandomizedShaep({
  randomizedPartCount = 4,
  interval = 1000,
}: RandomizedShaepProps) {
  const [colors, setColors] = useState(
    Array.from({ length: SHAEP_PART_COUNT }, randomColor)
  );

  function setRandomPartColor() {
    const randoPartIndexes = Array.from(
      { length: randomizedPartCount },
      randomColorIndex
    );

    setColors((state) =>
      state.map((color, i) =>
        randoPartIndexes.includes(i) ? randomColor() : color
      )
    );
  }

  useInterval(setRandomPartColor, interval);

  return <Shaep colors={colors} />;
}
