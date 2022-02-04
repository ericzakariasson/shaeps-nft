import {
  Box,
  Button,
  Flex,
  Heading,
  Spacer,
  Text,
  ToastId,
  useToast,
} from "@chakra-ui/react";
import { useEffect, useRef, useState } from "react";
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

  const [keyCount, setKeyCount] = useState(0);

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

  const isConnected = connectData.connected;

  return (
    <Box mb={["4", "4", "24"]}>
      <Flex mb="2">
        <Box>
          <Heading size="2xl" fontWeight="normal">
            shaeps
          </Heading>
        </Box>
        <Spacer />
        {isConnected && (
          <ConnectedAccount
            key={keyCount}
            address={accountData.address}
            ens={accountData.ens}
            onDisconnect={disconnect}
            onSwitchNetwork={() => setKeyCount((count) => count + 1)}
          />
        )}
        {!isConnected && (
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
