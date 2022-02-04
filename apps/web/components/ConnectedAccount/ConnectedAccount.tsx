import {
  Button,
  Popover,
  PopoverBody,
  PopoverCloseButton,
  PopoverContent,
  PopoverHeader,
  PopoverTrigger,
  Text,
  useToast,
} from "@chakra-ui/react";
import { Chain, useNetwork } from "wagmi";

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
  onSwitchNetwork: (chain: Chain) => void;
};

export function ConnectedAccount({
  ens,
  address,
  onDisconnect,
  onSwitchNetwork,
}: ConnectedAccountProps) {
  const toast = useToast({
    isClosable: true,
    position: "top",
  });

  async function handleSwitchNetwork() {
    await switchNetwork?.(supportedChain.id);
    onSwitchNetwork(supportedChain);
  }

  const [{ data: networkData }, switchNetwork] = useNetwork();
  const isUnsupported = networkData?.chain?.unsupported;
  const [supportedChain] = networkData.chains;

  if (isUnsupported) {
    return (
      <Button
        bg="none"
        border="1px"
        borderColor="indianred"
        color="indianred"
        borderRadius="0"
        lineHeight="2"
        onClick={handleSwitchNetwork}
      >
        switch network
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
