import { useEffect } from "react";
import { useContractRead, useProvider } from "wagmi";
import { Shaeps__factory } from "../../contract/types/factories/Shaeps__factory";
import { Shaeps } from "../../contract/types/Shaeps";

export function useShaepSupply() {
  const provider = useProvider();

  const contractConfig = {
    addressOrName: process.env.NEXT_PUBLIC_CONTRACT_ADDRESS,
    contractInterface: Shaeps__factory.abi,
    signerOrProvider: provider,
  };

  const [maxSupplyRequest, getMaxSupply] = useContractRead<Shaeps>(
    contractConfig,
    "maxSupply"
  );

  const [mintedSupplyRequest, getMintedSupply] = useContractRead<Shaeps>(
    contractConfig,
    "mintedSupply"
  );

  const [priceRequest, getPrice] = useContractRead<Shaeps>(
    contractConfig,
    "price"
  );

  useEffect(() => {
    getMaxSupply();
    getMintedSupply();
    getPrice();
  }, [getMaxSupply, getMintedSupply, getPrice]);

  return {
    maxSupplyRequest,
    mintedSupplyRequest,
    priceRequest,
  };
}
