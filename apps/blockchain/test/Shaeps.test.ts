import { expect } from "chai";
import { ethers } from "hardhat";

async function setupContract() {
  const [owner, collector] = await ethers.getSigners();
  const ContractFactory = await ethers.getContractFactory("Shaeps");

  const contract = await ContractFactory.deploy(
    "Shaeps",
    "SHAEPS",
    collector.address
  );

  return { contract, owner, collector };
}

describe("Contract", () => {
  describe("constructor", () => {
    it("should set name and symbol", async () => {
      const { contract } = await setupContract();

      const name = await contract.name();
      expect(name).to.equal("Shaeps");
      const symbol = await contract.symbol();
      expect(symbol).to.equal("SHAEPS");
    });

    it("should set collector", async () => {
      const { contract, collector: _collector } = await setupContract();
      const collector = await contract.collector();
      expect(collector).to.equal(_collector.address);
    });
  });

  describe("mint", () => {
    it("should throw if max supply is reached");

    it("should throw if not enough funds are sent", async () => {
      const { contract, owner } = await setupContract();
      expect(contract.mint(owner.address, { value: 1 })).to.be.revertedWith(
        "Insufficient funds provided"
      );
    });

    it("should emit Minted event", async () => {
      const { contract, owner } = await setupContract();
      expect(
        await contract.mint(owner.address, {
          value: ethers.utils.parseEther("0.1"),
        })
      ).to.emit(contract, "Minted");
    });
  });

  describe("mintedSupply", () => {
    it("should increment when minted", async () => {
      const { contract, owner } = await setupContract();

      const mintedSupply1 = await contract.mintedSupply();
      expect(mintedSupply1).to.equal(0);

      await contract.mint(owner.address, {
        value: ethers.utils.parseEther("0.1"),
      });

      const mintedSupply2 = await contract.mintedSupply();
      expect(mintedSupply2).to.equal(1);
    });
  });

  describe("generateSvg", () => {
    it("should return svg for token id", async () => {
      const { contract, owner } = await setupContract();

      await contract.mint(owner.address, {
        value: ethers.utils.parseEther("0.1"),
      });

      const svgUri = await contract.generateSvg(0);
      expect(svgUri.startsWith("data:image/svg+xml;base64")).to.equal(true);
    });
  });

  describe("generateMetadata", () => {
    function parseMetadataUri(uri: string) {
      const [, base64] = uri.split(",");
      const json = Buffer.from(base64, "base64").toString("ascii");

      const metadata = JSON.parse(json);
      return metadata;
    }

    it("should return base64 encoded json", async () => {
      const { contract, owner } = await setupContract();

      await contract.mint(owner.address, {
        value: ethers.utils.parseEther("0.1"),
      });

      const metadataUri = await contract.generateMetadata(0);
      expect(metadataUri.startsWith("data:application/json;base64")).to.equal(
        true
      );

      const metadata = parseMetadataUri(metadataUri);
      expect(metadata).to.be.an("object");
    });

    it("should generate name and description", async () => {
      const { contract, owner } = await setupContract();

      await contract.mint(owner.address, {
        value: ethers.utils.parseEther("0.1"),
      });

      const metadataUri = await contract.generateMetadata(0);
      const metadata = parseMetadataUri(metadataUri);
      expect(metadata.name).to.equal("Shaep #1");
      expect(metadata.description).to.be.a("string");
    });

    it("should generate image", async () => {
      const { contract, owner } = await setupContract();

      await contract.mint(owner.address, {
        value: ethers.utils.parseEther("0.1"),
      });

      const metadataUri = await contract.generateMetadata(0);
      const metadata = parseMetadataUri(metadataUri);
      expect(metadata.image.startsWith("data:image/svg+xml;base64")).to.equal(
        true
      );
    });

    it("should generate attributes", async () => {
      const { contract, owner } = await setupContract();

      await contract.mint(owner.address, {
        value: ethers.utils.parseEther("0.1"),
      });

      const metadataUri = await contract.generateMetadata(0);
      const metadata = parseMetadataUri(metadataUri);
      expect(metadata.attributes).to.be.an("array");

      metadata.attributes.forEach((attribute: unknown) => {
        expect(attribute).to.all.keys(["trait_type", "value"]);
      });
    });
  });

  describe("withdraw", () => {
    it("should withdraw funds to collector", async () => {
      const [, , minter] = await ethers.getSigners();
      const { contract, collector, owner } = await setupContract();

      await contract.connect(minter).mint(minter.address, {
        value: ethers.utils.parseEther("0.05"),
      });

      const balanceBefore = await collector.getBalance();
      await contract.connect(owner).withdraw();
      const balanceAfter = await collector.getBalance();
      const withdrawn = balanceAfter.sub(balanceBefore);
      expect(ethers.utils.formatEther(withdrawn)).to.equal("0.05");
    });

    it("should only be allowed by owner", async () => {
      const [, , minter] = await ethers.getSigners();
      const { contract } = await setupContract();
      expect(contract.connect(minter.address).withdraw()).to.be.revertedWith(
        ""
      );
    });
  });
});
