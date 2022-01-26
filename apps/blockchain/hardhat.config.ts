import { HardhatUserConfig } from "hardhat/config";

import "dotenv/config";
import "@nomiclabs/hardhat-etherscan";
import "@nomiclabs/hardhat-waffle";
import "@typechain/hardhat";
import "hardhat-gas-reporter";
import "solidity-coverage";

const accounts =
  process.env.PRIVATE_KEY !== undefined ? [process.env.PRIVATE_KEY] : [];

const config: HardhatUserConfig = {
  solidity: "0.8.4",
  networks: {
    rinkeby: {
      url: process.env.RINKEBY_URL,
      accounts,
    },
    "polygon-mumbai": {
      url: process.env.POLYGON_MUMBAI_URL,
      accounts,
      timeout: 10_000,
    },
  },
  gasReporter: {
    enabled: process.env.REPORT_GAS !== undefined,
    currency: "USD",
  },
  etherscan: {
    /**
     * @description according to documentation, `apiKey` can be an object with various api keys.
     * @see https://hardhat.org/plugins/nomiclabs-hardhat-etherscan.html#multiple-api-keys-and-alternative-block-explorers
     */
    apiKey: {
      rinkeby: process.env.ETHERSCAN_API_KEY as string,
      polygonMumbai: process.env.POLYGONSCAN_API_KEY as string,
    } as unknown as string,
  },
};

export default config;
