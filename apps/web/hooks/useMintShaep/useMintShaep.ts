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
  UnsufficientFunds = "INSUFFICIENT_FUNDS",
}

type UseMintShaepProps = {
  price: number | undefined;
};

export function useMintShaep({ price }: UseMintShaepProps) {
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
    if (price === undefined) {
      return toast({
        title: "The price is being fetched, please hold on!",
        status: "info",
      });
    }
    try {
      setMintState(MintState.Loading);
      const tx = await contract.mint(accountData.address, {
        value: price,
        gasLimit: process.env.NEXT_PUBLIC_MINT_GAS_LIMIT,
      });
      await tx.wait();
      setMintState(MintState.Success);
      toast({
        title: "Your Shaep has been minted",
        status: "success",
      });
    } catch (error) {
      switch (error.code) {
        case MintErrorCode.Rejected:
          toast({
            title: "Mint transaction was rejected",
            status: "warning",
          });
          setMintState(MintState.Initial);
          break;
        case MintErrorCode.UnsufficientFunds:
          toast({
            title: "Unsufficient funds",
            status: "warning",
          });
          setMintState(MintState.Initial);
          break;

        default:
          console.error("Error while minting:", error);
          toast({
            title: "An error occured while minting",
            description:
              "Please try again later! You can check the console for more details",
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
