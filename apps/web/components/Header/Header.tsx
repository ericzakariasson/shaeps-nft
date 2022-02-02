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
import { useEffect, useRef } from "react";
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

  const isUnsupported = networkData?.chain?.unsupported ?? false;
  const isConnected = connectData.connected;

  const [supportedChain] = networkData.chains;

  const toastIdRef = useRef<ToastId | undefined>();

  useEffect(() => {
    if (isUnsupported && !toastIdRef.current) {
      toastIdRef.current = toast({
        title: "Wrong network",
        description: (
          <>
            <Text mb="2">
              the contract is only available at {supportedChain.name}
            </Text>
            <Button
              bg="none"
              border="1px"
              borderColor="indianred"
              color="indianred"
              borderRadius="0"
              lineHeight="2"
              onClick={() => switchNetwork?.(supportedChain.id)}
              title={`switch network to ${supportedChain.name}`}
            >
              switch network
            </Button>
          </>
        ),
        status: "warning",
        duration: null,
      });
    }
    if (!isUnsupported && toastIdRef.current) {
      toast.close(toastIdRef.current);
    }
  }, [isUnsupported, supportedChain, toast, switchNetwork]);

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
            borderColor="black"
            color="black"
            borderRadius="0"
            lineHeight="2"
            onClick={() => switchNetwork?.(supportedChain.id)}
            title={`switch network to ${supportedChain.name}`}
          >
            switch network
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
