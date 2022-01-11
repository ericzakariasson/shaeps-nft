export const SHAEP_PART_COUNT = 6;

export type ShaepProps = {
  colors: string[];
};

const defaultColors: ShaepProps["colors"] = [
  "white",
  "white",
  "white",
  "black",
  "black",
  "black",
];

export function Shaep({ colors = defaultColors }: ShaepProps) {
  return (
    <svg viewBox="0 0 388 388" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path fill={colors[0]} d="M0 0h194v388H0z" shapeRendering="crispEdges" />
      <path
        fill={colors[1]}
        d="M194 0h194v388H194z"
        shapeRendering="crispEdges"
      />
      <path
        d="M97 193.75c0 53.434 43.566 96.75 97 96.75v-96.75H97Z"
        fill={colors[2]}
      />
      <path
        fill={colors[3]}
        d="M69 69h125v125H69z"
        shapeRendering="crispEdges"
      />
      <path
        d="M97 194v-.25C97 140.316 140.316 97 193.75 97s96.75 43.316 96.75 96.75v.25H97Z"
        fill={colors[4]}
      />
      <path
        d="M194 290.5V194h48v96.5h-48Z"
        fill={colors[5]}
        shapeRendering="crispEdges"
      />
    </svg>
  );
}
