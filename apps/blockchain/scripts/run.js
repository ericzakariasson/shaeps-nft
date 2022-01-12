const { ethers } = require("hardhat");

async function main() {
  const Shaeps = await ethers.getContractFactory("Shaeps");

  const shaeps = await Shaeps.deploy(
    "Shaeps",
    "SHAEPS",
    "0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266"
  );

  await shaeps.deployed();

  console.log("Shaeps deployed to:", shaeps.address);

  const tx = await shaeps.safeMint(
    "0x70997970c51812dc3a010c7d01b50e0d17dc79c8",
    {
      value: 1000000000000000,
    }
  );

  await tx.wait();

  console.log("NFT minted");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
