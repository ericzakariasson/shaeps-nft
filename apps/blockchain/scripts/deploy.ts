import "dotenv/config";
import { ethers } from "hardhat";

async function main() {
  const collector = process.env.COLLCTOR_ADDRESS;

  if (!collector) {
    throw new Error("Missing collector");
  }

  const Shaeps = await ethers.getContractFactory("Shaeps");

  const shaeps = await Shaeps.deploy("Shaeps", "SHAEPS", collector);

  await shaeps.deployed();

  console.log("Shaeps deployed to:", shaeps.address);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
