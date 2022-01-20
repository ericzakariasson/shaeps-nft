import { useSigner, useAccount, useContract } from "wagmi";
import { Shaeps } from "../../contract/types/Shaeps";

import { Shaeps__factory } from "../../contract/types/factories/Shaeps__factory";
import { useState } from "react";

export enum MintState {
  Initial,
  Loading,
  Completed,
}

export function useMintShaep() {
  const [{ data: signerData }] = useSigner();
  const [{ data: accountData }] = useAccount();

  const contract = useContract<Shaeps>({
    addressOrName: process.env.NEXT_PUBLIC_CONTRACT_ADDRESS,
    contractInterface: Shaeps__factory.abi,
    signerOrProvider: signerData,
  });

  const [mintState, setMintState] = useState<MintState>(MintState.Initial);

  async function handleMint() {
    setMintState(MintState.Loading);
    const tx = await contract.mint(accountData.address, { value: 6_000_000 });
    await tx.wait();
    setMintState(MintState.Completed);
    console.log("Minted", `https://rinkeby.etherscan.io/tx/${tx.hash}`);
  }

  return {
    mintState,
    onMint: handleMint,
  };
}
