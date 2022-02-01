import {
  Box,
  Button,
  Flex,
  Heading,
  Spacer,
  Text,
  useToast,
} from "@chakra-ui/react";
import { useEffect } from "react";
import { chain, useAccount, useConnect, useNetwork } from "wagmi";
import { ConnectAccount } from "../ConnectAccount";
import { ConnectedAccount } from "../ConnectedAccount";

enum ConnectErrorName {
  UserRejectedRequestError = "UserRejectedRequestError",
}

export function Header() {
  const toast = useToast({
    isClosable: true,
    position: "top",
  });

  const [{ data: connectData, error: connectError }, connect] = useConnect();

  const [{ data: accountData }, disconnect] = useAccount({
    fetchEns: true,
  });

  useEffect(() => {
    if (!connectError) return;

    if (
      connectError.name === ConnectErrorName.UserRejectedRequestError.toString()
    ) {
      toast({
        title: "Wallet connection request was cancelled",
        status: "warning",
      });
    } else {
      toast({
        title: "An error occured while connecting",
        description: connectError.message,
        status: "error",
      });
    }
  }, [connectError, toast]);

  const [{ data: networkData }, switchNetwork] = useNetwork();

  const isWalletConnect = connectData?.connector?.name === "WalletConnect";
  const isUnsupported = networkData?.chain?.unsupported;
  const isConnected = connectData.connected;

  const [supportedChain] = networkData.chains;

  return (
    <Box mb={["4", "4", "24"]}>
      <Flex mb="2">
        <Box>
          <Heading size="2xl" fontWeight="normal">
            shaeps
          </Heading>
        </Box>
        <Spacer />
        {isUnsupported && (
          <Button
            bg="none"
            border="1px"
            borderColor="indianred"
            color="indianred"
            borderRadius="0"
            lineHeight="2"
            onClick={
              isWalletConnect
                ? undefined
                : () => switchNetwork(supportedChain.id)
            }
          >
            switch network to {supportedChain.name}
          </Button>
        )}
        {!isUnsupported && isConnected && (
          <ConnectedAccount
            address={accountData.address}
            ens={accountData.ens}
            onDisconnect={disconnect}
          />
        )}
        {!isUnsupported && !isConnected && (
          <ConnectAccount
            connectors={connectData.connectors}
            onConnect={connect}
          />
        )}
      </Flex>
      <Text>just some lines and colors, probably shaeps</Text>
    </Box>
  );
}
