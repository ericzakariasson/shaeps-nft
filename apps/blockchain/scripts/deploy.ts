import "dotenv/config";
import { ethers, run } from "hardhat";

async function main() {
  const collector = process.env.COLLECTOR_ADDRESS;

  if (!collector) {
    throw new Error("Missing collector");
  }

  const name = "Shaeps";
  const symbol = "SHAEPS";

  const Shaeps = await ethers.getContractFactory("Shaeps");

  const shaeps = await Shaeps.deploy(name, symbol, collector);

  await shaeps.deployed();

  console.log("Shaeps deployed to:", shaeps.address);

  await run("verify:verify", {
    address: shaeps.address,
    constructorArguments: [name, symbol, collector],
  });
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
