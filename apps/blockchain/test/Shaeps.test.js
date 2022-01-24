// const { expect } = require("chai");

describe("Contract", () => {
  describe("mintedSupply", () => {
    it("should return minted supply");
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

  describe("mint", () => {
    it("should throw if max supply is reached");
    it("should throw if not enough funds are sent");
    it("should mint an ERC721 token");
  });

  describe("withdraw", () => {
    it("should withdraw funds to collector");
  });
});
