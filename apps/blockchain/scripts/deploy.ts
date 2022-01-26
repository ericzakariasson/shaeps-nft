import "dotenv/config";
import { ethers, run } from "hardhat";

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function main() {
  const collector = process.env.COLLECTOR_ADDRESS;

  if (!collector) {
    throw new Error("Missing collector");
  }

  const name = "Shaeps";
  const symbol = "SHAEPS";
  const paused = true;

  const Shaeps = await ethers.getContractFactory("Shaeps");

  const shaeps = await Shaeps.deploy(name, symbol, collector, paused);

  await shaeps.deployed();

  console.log("Shaeps deployed to:", shaeps.address);

  await sleep(30_000);

  await run("verify:verify", {
    address: shaeps.address,
    constructorArguments: [name, symbol, collector, paused],
  });
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
