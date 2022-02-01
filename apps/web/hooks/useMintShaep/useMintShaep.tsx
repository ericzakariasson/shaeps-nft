import { Link, useToast } from "@chakra-ui/react";
import { BigNumber } from "ethers";
import { useState } from "react";
import {
  useAccount,
  useContract,
  useContractEvent,
  useProvider,
  useSigner,
} from "wagmi";
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
  onMintedEvent: () => void;
};

export function useMintShaep({ price, onMintedEvent }: UseMintShaepProps) {
  const [{ data: signerData }] = useSigner();
  const [{ data: accountData }] = useAccount();
  const provider = useProvider();

  const toast = useToast({
    isClosable: true,
    position: "top",
  });

  const contractConfig = {
    addressOrName: process.env.NEXT_PUBLIC_CONTRACT_ADDRESS,
    contractInterface: Shaeps__factory.abi,
  };

  const contract = useContract<Shaeps>({
    ...contractConfig,
    signerOrProvider: signerData,
  });

  const [mintState, setMintState] = useState<MintState>(MintState.Initial);

  function handleMinted([to, tokenId]: [string, BigNumber]) {
    onMintedEvent();
    if (accountData.address === to) {
      const openSeaUrl = `${OPENSEA_ASSETS_BASE_URL}/${CONTRACT_ADDRESS}/${tokenId.toNumber()}`;
      toast({
        title: "Your Shaep has been minted",
        description: (
          <Link isExternal href={openSeaUrl}>
            View it on OpenSea
          </Link>
        ),
        status: "success",
        duration: null,
      });
    }
  }

  useContractEvent<Shaeps>(
    { ...contractConfig, signerOrProvider: provider },
    "Minted",
    handleMinted
  );

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
