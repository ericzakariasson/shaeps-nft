import { Box, Container, Flex, Heading, Text } from "@chakra-ui/react";
import Head from "next/head";
import { useEffect } from "react";
import { useAccount, useConnect, useNetwork } from "wagmi";
import { Footer } from "../components/Footer";
import { Header } from "../components/Header";
import { InfoText } from "../components/InfoText";
import { MintForm } from "../components/MintForm";
import { Shaep } from "../components/Shaep";
import { MintState, useMintShaep } from "../hooks/useMintShaep/useMintShaep";
import { useRandomizedShaep } from "../hooks/useRandomizedShaep";
import { useShaepSupply } from "../hooks/useShaepSupply";

function Main() {
  const { colors } = useRandomizedShaep({
    randomizedPartCount: 3,
    interval: 1000,
  });

  const { maxSupply, mintedSupply, price, allMinted } = useShaepSupply();

  const { mintState, onMint } = useMintShaep({
    price,
  });

  const formattedSupply = `${mintedSupply ?? "?"}/${maxSupply ?? "?"}`;

  return (
    <>
      <Head>
        <title>Shaeps — {formattedSupply} minted</title>
      </Head>
      <Flex as="main" direction={["column", "column", "row"]} mb="8">
        <Box
          border="1px"
          flex="1"
          mr={["0", "0", "8"]}
          mb={["8", "8", "0"]}
          title="Randomly generated Shaep"
        >
          <Shaep colors={colors} />
        </Box>
        <Flex flex="1" direction="column">
          <Box order={[1, 1, 0]} mb={["0", "0", "4"]}>
            <Heading as="h2" size="md" mb="2">
              what this is
            </Heading>
            <InfoText maxSupply={maxSupply} price={price} />
          </Box>
          <Flex
            order={[0, 0, 1]}
            mb={[4, 4, 0]}
            mt={[0, 0, "auto"]}
            direction={[allMinted ? "column" : "row", "row", "column"]}
            align={[allMinted ? "start" : "end", "end", "flex-start"]}
            justify={["space-between", "space-between", "unset"]}
          >
            <Text fontSize="xl" mb={[allMinted ? 2 : 0, 0, "2"]}>
              {formattedSupply} minted
            </Text>
            {!allMinted && (
              <Box>
                <MintForm
                  onMint={() => onMint()}
                  isLoading={mintState === MintState.Loading}
                />
              </Box>
            )}
            {allMinted && (
              <Text bg="black" color="white" px="4" py="2" display="inline">
                All Shaeps have been minted. Thank you. Talk soon
              </Text>
            )}
          </Flex>
        </Flex>
      </Flex>
    </>
  );
}

export default function Index() {
  return (
    <Container
      as={Flex}
      maxW="container.lg"
      py={["4", "4", "12"]}
      minHeight="100vh"
      direction="column"
    >
      <Header />
      <Main />
      <Footer />
    </Container>
  );
}
