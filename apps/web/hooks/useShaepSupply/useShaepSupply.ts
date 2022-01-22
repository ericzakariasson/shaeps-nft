import { useEffect, useState } from "react";
import { useContract, useProvider } from "wagmi";
import { Shaeps__factory } from "../../contract/types/factories/Shaeps__factory";
import { Shaeps } from "../../contract/types/Shaeps";

async function tryCatch<T>(fn: () => Promise<T>) {
  let result: T | null = null;
  try {
    result = await fn();
  } catch (errro) {}

  return result;
}

export function useShaepSupply() {
  const [mintedSupply, setMintedSupply] = useState<number | null>(null);
  const [maxSupply, setMaxSupply] = useState<number | null>(null);
  const [price, setPrice] = useState<number | null>(null);

  const provider = useProvider();

  const contract = useContract<Shaeps>({
    addressOrName: process.env.NEXT_PUBLIC_CONTRACT_ADDRESS,
    contractInterface: Shaeps__factory.abi,
    signerOrProvider: provider,
  });

  function handleMinted() {
    setMintedSupply((supply) => supply + 1);
  }

  useEffect(() => {
    async function fetchInitialState() {
      const [maxSupplyResponse, mintedSupplyResponse, priceResponse] =
        await Promise.all([
          tryCatch(contract.maxSupply),
          tryCatch(contract.mintedSupply),
          tryCatch(contract.price),
        ]);

      setMaxSupply(maxSupplyResponse?.toNumber());
      setMintedSupply(mintedSupplyResponse?.toNumber());
      setPrice(priceResponse?.toNumber());
    }
    fetchInitialState();

    contract.on("Minted", handleMinted);

    return () => {
      contract.off("Minted", handleMinted);
    };
  }, [contract]);

  return {
    maxSupply,
    mintedSupply,
    price,
    allMinted: maxSupply - mintedSupply === 0,
  };
}
