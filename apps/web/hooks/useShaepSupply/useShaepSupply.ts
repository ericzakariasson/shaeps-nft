import { useEffect, useState } from "react";
import { useContractRead, useProvider } from "wagmi";
import { Shaeps__factory } from "../../contract/types/factories/Shaeps__factory";

export function useShaepSupply() {
  const [totalSupply, setTotalSupply] = useState<number | null>(null);

  const provider = useProvider();

  const contractConfig = {
    addressOrName: process.env.NEXT_PUBLIC_CONTRACT_ADDRESS,
    contractInterface: Shaeps__factory.abi,
    signerOrProvider: provider,
  };

  const [totalSupplyRequest, getTotalSupply] = useContractRead(
    contractConfig,
    "totalSupply"
  );
  const [maxSupplyRequest, getMaxSupply] = useContractRead(
    contractConfig,
    "maxSupply"
  );
  const [priceRequest, getPrice] = useContractRead(contractConfig, "price");

  const maxSupply = maxSupplyRequest.data?.toNumber() ?? null;
  const price = priceRequest.data?.toString() ?? null;

  console.log(totalSupplyRequest);
  useEffect(() => {
    if (totalSupplyRequest.data) {
      setTotalSupply(totalSupplyRequest.data.toNumber());
    }
  }, [totalSupplyRequest.data]);

  const isLoading =
    totalSupplyRequest.loading ||
    maxSupplyRequest.loading ||
    priceRequest.loading;

  useEffect(() => {
    getTotalSupply();
    getMaxSupply();
    getPrice();
  }, [getTotalSupply, getMaxSupply, getPrice]);

  const allMinted =
    typeof maxSupply === "number" &&
    typeof totalSupply === "number" &&
    maxSupply === totalSupply;

  return {
    maxSupply,
    totalSupply,
    price,
    allMinted,
    isLoading,
    incrementTotalSupply: () => setTotalSupply((supply) => supply + 1),
  };
}
