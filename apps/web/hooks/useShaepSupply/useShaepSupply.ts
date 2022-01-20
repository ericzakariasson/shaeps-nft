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

  const [totalSupplyRequest] = useContractRead<Shaeps>(
    contractConfig,
    "getTotalSupply"
  );

  const [mintedSupplyRequest] = useContractRead<Shaeps>(
    contractConfig,
    "getMintedSupply"
  );

  return {
    totalSupplyRequest,
    mintedSupplyRequest,
  };
}
