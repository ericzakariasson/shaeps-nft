import { ChakraProvider } from "@chakra-ui/react";
import "@fontsource/spectral";
import type { AppProps } from "next/app";
import { Provider, chain } from "wagmi";
import { InjectedConnector } from "wagmi/connectors/injected";
import { WalletConnectConnector } from "wagmi/connectors/walletConnect";

import "../index.css";
import { theme } from "../theme";

const chains = [chain.rinkeby, chain.polygonTestnetMumbai];

const injectedConnector = new InjectedConnector({ chains });

const walletConnectConnector = new WalletConnectConnector({
  chains,
  options: {
    qrcode: true,
    // TODO: add infura id
  },
});

const connectors = [injectedConnector, walletConnectConnector];

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <ChakraProvider theme={theme}>
      <Provider connectors={() => connectors} autoConnect>
        <Component {...pageProps} />
      </Provider>
    </ChakraProvider>
  );
}

export default MyApp;
