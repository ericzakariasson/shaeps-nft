import { useEffect, useState } from "react";
import { useContractEvent, useProvider, useContractRead } from "wagmi";
import { Shaeps__factory } from "../../contract/types/factories/Shaeps__factory";
import { Shaeps } from "../../contract/types/Shaeps";

export function useShaepSupply() {
  const [mintedSupply, setMintedSupply] = useState<number | null>(null);

  const provider = useProvider();

  const contractConfig = {
    addressOrName: process.env.NEXT_PUBLIC_CONTRACT_ADDRESS,
    contractInterface: Shaeps__factory.abi,
    signerOrProvider: provider,
  };

  function handleMinted() {
    setMintedSupply((supply) => supply + 1);
  }

  useContractEvent<Shaeps>(contractConfig, "Minted", handleMinted);

  const [mintedSupplyRequest, getMintedSupply] = useContractRead(
    contractConfig,
    "mintedSupply"
  );
  const [maxSupplyRequest, getMaxSupply] = useContractRead(
    contractConfig,
    "maxSupply"
  );
  const [priceRequest, getPrice] = useContractRead(contractConfig, "price");

  useEffect(() => {
    getMintedSupply();
    getMaxSupply();
    getPrice();
  }, [getMintedSupply, getMaxSupply, getPrice]);

  const maxSupply = maxSupplyRequest.data?.toNumber() ?? null;
  const price = priceRequest.data?.toNumber() ?? null;

  useEffect(() => {
    if (mintedSupplyRequest.data) {
      setMintedSupply(mintedSupplyRequest.data.toNumber());
    }
  }, [mintedSupplyRequest.data]);

  return {
    maxSupply,
    mintedSupply,
    price,
    allMinted: maxSupply - mintedSupply === 0,
  };
}
