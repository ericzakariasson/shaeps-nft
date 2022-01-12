const { ethers } = require("hardhat");

async function main() {
  const Shaeps = await ethers.getContractFactory("Shaeps");

  const shaeps = await Shaeps.deploy(
    "Shaeps",
    "SHAEPS",
    "0x9B46d5E5e96c3dD6fCb6DD7ccb4a5A049a7e5d31"
  );

  await shaeps.deployed();

  console.log("Shaeps deployed to:", shaeps.address);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
