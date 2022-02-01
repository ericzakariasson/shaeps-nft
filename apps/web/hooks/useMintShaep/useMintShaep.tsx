import { Link, useToast } from "@chakra-ui/react";
import { useState } from "react";
import { useAccount, useContract, useSigner } from "wagmi";
import {
  CONTRACT_ADDRESS,
  OPENSEA_ASSETS_BASE_URL,
} from "../../constants/urls";
import { Shaeps__factory } from "../../contract/types/factories/Shaeps__factory";
import { Shaeps } from "../../contract/types/Shaeps";

export enum MintState {
  Initial,
  Loading,
  Success,
  Error,
}

enum MintErrorCode {
  Rejected = 4001,
  InsufficientFunds = "INSUFFICIENT_FUNDS",
}

type UseMintShaepProps = {
  price: string | null;
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
    if (price === null) {
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
      const openSeaUrl = `${OPENSEA_ASSETS_BASE_URL}/${CONTRACT_ADDRESS}/1`;
      toast({
        title: "Your Shaep has been minted",
        description: (
          <Link isExternal href={openSeaUrl}>
            View it on OpenSea
          </Link>
        ),
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
        case MintErrorCode.InsufficientFunds:
          toast({
            title: "Insufficient funds",
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
