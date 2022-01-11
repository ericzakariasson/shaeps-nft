import { ChakraProvider } from "@chakra-ui/react";
import "@fontsource/spectral";
import type { AppProps } from "next/app";
import { Provider } from "wagmi";
import "../index.css";
import { theme } from "../theme";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <ChakraProvider theme={theme}>
      <Provider>
        <Component {...pageProps} />
      </Provider>
    </ChakraProvider>
  );
}

export default MyApp;
