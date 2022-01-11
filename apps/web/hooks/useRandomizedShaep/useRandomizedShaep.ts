import { useInterval } from "@chakra-ui/react";
import { useState } from "react";
import { SHAEP_PART_COUNT } from "../../components/Shaep";
import { randomColor, randomColorIndex } from "./helpers";

type UseRandomizedShaepProps = {
  randomizedPartCount?: number;
  interval?: number;
};

export function useRandomizedShaep({
  randomizedPartCount = 4,
  interval = 1000,
}: UseRandomizedShaepProps) {
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

  return { colors };
}
