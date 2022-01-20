import { useContractRead } from "wagmi";

import { Shaeps__factory } from "../../contract/types/factories/Shaeps__factory";
import { Shaeps } from "../../contract/types/Shaeps";

export function useShaepSupply() {
  const [totalSupplyRequest] = useContractRead<Shaeps>(
    {
      addressOrName: process.env.NEXT_PUBLIC_CONTRACT_ADDRESS,
      contractInterface: Shaeps__factory.abi,
    },
    "getTotalSupply"
  );

  const [mintedSupplyRequest] = useContractRead<Shaeps>(
    {
      addressOrName: process.env.NEXT_PUBLIC_CONTRACT_ADDRESS,
      contractInterface: Shaeps__factory.abi,
    },
    "getMintedSupply"
  );

  return {
    totalSupplyRequest,
    mintedSupplyRequest,
  };
}
