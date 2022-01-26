import { expect } from "chai";
import { ethers } from "hardhat";

interface SetupContractOptions {
  paused: boolean;
}

async function setupContract({ paused }: SetupContractOptions) {
  const [owner, collector] = await ethers.getSigners();
  const ContractFactory = await ethers.getContractFactory("Shaeps");

  const contract = await ContractFactory.deploy(
    "Shaeps",
    "SHAEPS",
    collector.address,
    paused
  );

  return { contract, owner, collector };
}

const mintCost = ethers.utils.parseEther("1");

describe("Contract", () => {
  describe("constructor", () => {
    it("should set name and symbol", async () => {
      const { contract } = await setupContract({ paused: true });

      const name = await contract.name();
      expect(name).to.equal("Shaeps");
      const symbol = await contract.symbol();
      expect(symbol).to.equal("SHAEPS");
    });

    it("should set collector", async () => {
      const { contract, collector: _collector } = await setupContract({
        paused: true,
      });
      const collector = await contract.collector();
      expect(collector).to.equal(_collector.address);
    });
  });

  describe("mint", () => {
    it("should throw if max supply is reached");

    it("should throw if not enough funds are sent", async () => {
      const { contract, owner } = await setupContract({ paused: false });
      expect(
        contract.mint(owner.address, {
          value: ethers.utils.parseEther("0.9"),
        })
      ).to.be.revertedWith("Insufficient funds provided");
    });

    it("should emit Minted event", async () => {
      const { contract, owner } = await setupContract({ paused: false });
      expect(
        await contract.mint(owner.address, {
          value: mintCost,
        })
      ).to.emit(contract, "Minted");
    });

    it("should throw if paused", async () => {
      const { contract, owner } = await setupContract({ paused: true });
      expect(
        contract.mint(owner.address, { value: mintCost })
      ).to.be.revertedWith("Minting is paused");
    });
  });

  describe("mintedSupply", () => {
    it("should increment when minted", async () => {
      const { contract, owner } = await setupContract({ paused: false });

      const mintedSupply1 = await contract.mintedSupply();
      expect(mintedSupply1).to.equal(0);

      await contract.mint(owner.address, {
        value: mintCost,
      });

      const mintedSupply2 = await contract.mintedSupply();
      expect(mintedSupply2).to.equal(1);
    });
  });

  describe("generateSvg", () => {
    it("should return svg for token id", async () => {
      const { contract, owner } = await setupContract({ paused: false });

      await contract.mint(owner.address, {
        value: mintCost,
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
      const { contract, owner } = await setupContract({ paused: false });

      await contract.mint(owner.address, {
        value: mintCost,
      });

      const metadataUri = await contract.generateMetadata(0);
      expect(metadataUri.startsWith("data:application/json;base64")).to.equal(
        true
      );

      const metadata = parseMetadataUri(metadataUri);
      expect(metadata).to.be.an("object");
    });

    it("should generate name and description", async () => {
      const { contract, owner } = await setupContract({ paused: false });

      await contract.mint(owner.address, {
        value: mintCost,
      });

      const metadataUri = await contract.generateMetadata(0);
      const metadata = parseMetadataUri(metadataUri);
      expect(metadata.name).to.equal("Shaep #1");
      expect(metadata.description).to.be.a("string");
    });

    it("should generate image", async () => {
      const { contract, owner } = await setupContract({ paused: false });

      await contract.mint(owner.address, {
        value: mintCost,
      });

      const metadataUri = await contract.generateMetadata(0);
      const metadata = parseMetadataUri(metadataUri);
      expect(metadata.image.startsWith("data:image/svg+xml;base64")).to.equal(
        true
      );
    });

    it("should generate attributes", async () => {
      const { contract, owner } = await setupContract({ paused: false });

      await contract.mint(owner.address, {
        value: mintCost,
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
      const { contract, collector, owner } = await setupContract({
        paused: false,
      });

      await contract.connect(minter).mint(minter.address, {
        value: mintCost,
      });

      const balanceBefore = await collector.getBalance();
      await contract.connect(owner).withdraw();
      const balanceAfter = await collector.getBalance();
      const withdrawn = balanceAfter.sub(balanceBefore);
      expect(withdrawn).to.equal(mintCost);
    });

    it("should only be allowed by owner", async () => {
      const [, , minter] = await ethers.getSigners();
      const { contract } = await setupContract({ paused: true });
      expect(contract.connect(minter.address).withdraw()).to.be.revertedWith(
        ""
      );
    });
  });
});
