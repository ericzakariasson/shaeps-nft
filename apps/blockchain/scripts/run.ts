import { ethers } from "hardhat";

const COUNT = 10;

async function main() {
  const [owner] = await ethers.getSigners();

  const collector = owner.address;

  const name = "Shaeps";
  const symbol = "SHAEPS";
  const paused = false;

  const Shaeps = await ethers.getContractFactory("Shaeps");

  const shaeps = await Shaeps.deploy(name, symbol, collector, paused);

  await shaeps.deployed();

  console.log("Shaeps deployed to:", shaeps.address);

  for (let i = 0; i < COUNT; i++) {
    const tx = await shaeps.mint("0x70997970c51812dc3a010c7d01b50e0d17dc79c8", {
      value: ethers.utils.parseEther("1"),
    });

    await tx.wait();
    console.log("NFT minted", i);
    const metadata = await shaeps.generateMetadata(i);
    console.log(metadata);
    console.log("\n");
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
