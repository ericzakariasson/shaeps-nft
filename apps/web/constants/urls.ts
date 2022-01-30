function getEnvStageUrl(nonProductionValue: string, productionValue: string) {
  const isProduction = process.env.NEXT_PUBLIC_STAGE === "production";
  return isProduction ? productionValue : nonProductionValue;
}

export const BLOCKCHAIN_EXPLORER_BASE_URL = getEnvStageUrl(
  "https://mumbai.polygonscan.com",
  "https://polygonscan.com"
);

export const OPENSEA_BASE_URL = getEnvStageUrl(
  "https://testnets.opensea.io",
  "https://opensea.io"
);

export const OPENSEA_ASSETS_BASE_URL = getEnvStageUrl(
  `${OPENSEA_BASE_URL}/assets/mumbai`,
  `${OPENSEA_BASE_URL}/assets/matic`
);

export const OPENSEA_COLLECTION_URL = `${OPENSEA_BASE_URL}/collection/${
  process.env.NEXT_PUBLIC_COLLECTION_NAME ?? "shaeps"
}`;

export const CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS;
