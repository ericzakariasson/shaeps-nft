import { useSigner, useAccount, useContract } from "wagmi";
import { Shaeps } from "../../contract/types/Shaeps";
import { ethers } from "ethers";

import { Shaeps__factory } from "../../contract/types/factories/Shaeps__factory";
import { useState } from "react";
import { useToast } from "@chakra-ui/react";

export enum MintState {
  Initial,
  Loading,
  Success,
  Error,
}

enum MintErrorCode {
  Rejected = 4001,
}

export function useMintShaep() {
  const [{ data: signerData }] = useSigner();
  const [{ data: accountData }] = useAccount();

  const toast = useToast({
    isClosable: true,
    position: "top",
  });

  const contract = useContract<Shaeps>({
    addressOrName: process.env.NEXT_PUBLIC_CONTRACT_ADDRESS,
    contractInterface: Shaeps__factory.abi,
    signerOrProvider: signerData,
  });

  const [mintState, setMintState] = useState<MintState>(MintState.Initial);

  async function handleMint() {
    try {
      setMintState(MintState.Loading);
      const tx = await contract.mint(accountData.address, {
        value: ethers.utils.parseEther("0.006"),
      });
      await tx.wait();
      setMintState(MintState.Success);
      console.log("Minted", `https://rinkeby.etherscan.io/tx/${tx.hash}`);
    } catch (error) {
      if (error.code === MintErrorCode.Rejected) {
        toast({
          title: "Mint transaction was rejected",
          status: "warning",
        });
        setMintState(MintState.Initial);
      } else {
        toast({
          title: "An error occured while minting",
          description: error.message ?? undefined,
          status: "error",
        });
        setMintState(MintState.Error);
      }
    }
  }

  return {
    mintState,
    onMint: handleMint,
  };
}
