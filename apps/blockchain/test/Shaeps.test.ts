import { expect } from "chai";
import { ethers } from "hardhat";

async function setupContract() {
  const [owner] = await ethers.getSigners();
  const ContractFactory = await ethers.getContractFactory("Shaeps");

  const contract = await ContractFactory.deploy(
    "Shaeps",
    "SHAEPS",
    owner.address
  );

  return contract;
}

describe("Contract", () => {
  describe("constructor", () => {
    it("should set name and symbol", async () => {
      const contract = await setupContract();

      const name = await contract.name();
      expect(name).to.equal("Shaeps");
      const symbol = await contract.symbol();
      expect(symbol).to.equal("SHAEPS");
    });

    it("should set collector", async () => {
      const [owner] = await ethers.getSigners();
      const contract = await setupContract();
      const collector = await contract.collector();
      expect(collector).to.equal(owner.address);
    });
  });

  describe("mint", () => {
    it("should throw if max supply is reached");
    it("should throw if not enough funds are sent");
    it("should mint an ERC721 token");
  });

  describe("mintedSupply", () => {
    it("should increment when minted", async () => {
      const [owner] = await ethers.getSigners();
      const contract = await setupContract();

      const mintedSupply1 = await contract.mintedSupply();
      expect(mintedSupply1).to.equal(0);

      await contract.mint(owner.address);

      const mintedSupply2 = await contract.mintedSupply();
      expect(mintedSupply2).to.equal(1);
    });
  });

  describe("generateSvg", () => {
    it("should return svg for token id");
  });

  describe("generateMetadata", () => {
    it("should return base64 encoded json");
    it("should generate name");
    it("should generate description");
    it("should generate image");
    it("should generate attributes");
  });

  describe("withdraw", () => {
    it("should withdraw funds to collector");
  });
});
