import {
  Popover,
  PopoverTrigger,
  Button,
  PopoverContent,
  PopoverHeader,
  PopoverCloseButton,
  PopoverBody,
  Text,
} from "@chakra-ui/react";
import { useNetwork, chain, useProvider, useConnect } from "wagmi";

function formatAccountAddress(address: string) {
  return `${address.substring(0, 5)}...${address.substring(
    address.length - 4
  )}`;
}

type ConnectedAccountProps = {
  address: string;
  ens?: {
    name: string;
    avatar: string | null;
  };
  onDisconnect: () => void;
};

export function ConnectedAccount({
  ens,
  address,
  onDisconnect,
}: ConnectedAccountProps) {
  const [
    {
      data: { connector },
    },
  ] = useConnect();
  const [{ data: networkData }, switchNetwork] = useNetwork();

  const isWalletConnect = connector?.name === "WalletConnect";

  if (networkData.chain.unsupported) {
    return (
      <Button
        bg="none"
        border="1px"
        borderColor="indianred"
        color="indianred"
        borderRadius="0"
        lineHeight="2"
        onClick={
          isWalletConnect ? undefined : () => switchNetwork(chain.rinkeby.id)
        }
      >
        switch network to {chain.rinkeby.name}
      </Button>
    );
  }

  return (
    <Popover placement="top-end">
      <PopoverTrigger>
        <Button bg="none" border="1px" borderRadius="0" lineHeight="2">
          {ens?.name ?? formatAccountAddress(address)}
        </Button>
      </PopoverTrigger>
      <PopoverContent borderRadius="0">
        <PopoverHeader fontWeight="semibold">account</PopoverHeader>
        <PopoverCloseButton />
        <PopoverBody>
          <Text mb="2">
            {address}
            {ens ? ` • ${ens.name}` : ""}
          </Text>
          <Button
            variant="link"
            color="indianred"
            lineHeight="2"
            onClick={onDisconnect}
          >
            disconnect
          </Button>
        </PopoverBody>
      </PopoverContent>
    </Popover>
  );
}
