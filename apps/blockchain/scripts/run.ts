import { ethers, run } from "hardhat";

async function main() {
  await run("compile");

  const Shaeps = await ethers.getContractFactory("Shaeps");
  const shaeps = await Shaeps.deploy();

  await shaeps.deployed();

  console.log("Shaeps deployed to:", shaeps.address);

  const data = await Promise.all([
    shaeps.generateSvg(1),
    shaeps.generateSvg(2),
    shaeps.generateSvg(3),
    shaeps.generateSvg(4),
    shaeps.generateSvg(5),
  ]);

  console.log(data.map((uri, i) => `${i + 1}. ${uri}`).join("\n\n"));
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
