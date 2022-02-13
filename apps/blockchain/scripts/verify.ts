import "dotenv/config";
import { run } from "hardhat";

async function main() {
  const collector = process.env.COLLECTOR_ADDRESS;

  if (!collector) {
    throw new Error("Missing collector");
  }

  const address = process.env.DEPLOYED_ADDRESS;

  if (!address) {
    throw new Error("Missing address");
  }

  const name = "Shaeps";
  const symbol = "SHAEPS";
  const paused = false;

  await run("verify:verify", {
    address,
    constructorArguments: [name, symbol, collector, paused],
  });
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
