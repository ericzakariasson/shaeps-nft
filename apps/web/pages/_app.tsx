import { ChakraProvider } from "@chakra-ui/react";
import "@fontsource/spectral";
import type { AppProps } from "next/app";
import { Provider, chain } from "wagmi";
import { InjectedConnector } from "wagmi/connectors/injected";
import { WalletConnectConnector } from "wagmi/connectors/walletConnect";
import { providers } from "ethers";

import "../index.css";
import { theme } from "../theme";

function getConnectors(chainId: number) {
  const chains = [chain.rinkeby, chain.polygonTestnetMumbai];
  const injectedConnector = new InjectedConnector({ chains });

  const walletConnectConnector = new WalletConnectConnector({
    chains,
    options: {
      qrcode: true,
    },
  });
  return [injectedConnector, walletConnectConnector];
}

function getProvider(chainId: number) {
  const alchemyProvider = new providers.AlchemyProvider(
    chainId,
    process.env.NEXT_PUBLIC_ALCHEMY_API_KEY
  );

  return alchemyProvider;
}

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <ChakraProvider theme={theme}>
      <Provider
        provider={({ chainId }) => getProvider(chainId)}
        connectors={({ chainId }) => getConnectors(chainId)}
        autoConnect
      >
        <Component {...pageProps} />
      </Provider>
    </ChakraProvider>
  );
}

export default MyApp;
