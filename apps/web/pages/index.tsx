import {
  Box,
  Container,
  Flex,
  Heading,
  Link,
  ListItem,
  Text,
  UnorderedList,
} from "@chakra-ui/react";
import { ethers } from "ethers";
import Head from "next/head";
import { useNetwork } from "wagmi";
import { Footer } from "../components/Footer";
import { Header } from "../components/Header";
import { MintForm } from "../components/MintForm";
import { Shaep } from "../components/Shaep";
import { OPENSEA_COLLECTION_URL } from "../constants/urls";
import { MintState, useMintShaep } from "../hooks/useMintShaep/useMintShaep";
import { useRandomizedShaep } from "../hooks/useRandomizedShaep";
import { useShaepSupply } from "../hooks/useShaepSupply";

const COLOR_COUNT = 9;
const PART_COUNT = 6;

function Main() {
  const { colors } = useRandomizedShaep({
    randomizedPartCount: 3,
    interval: 1000,
  });

  const { maxSupply, mintedSupply, price, allMinted } = useShaepSupply();

  const [{ data: networkData }] = useNetwork();
  const isReady = !networkData?.chain?.unsupported ?? false;

  const { mintState, onMint } = useMintShaep({
    price,
  });

  const formattedPrice = ethers.utils.formatEther(price ?? 0);
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
            <Text mb="2">
              this project was created to bring some simple and elegant shapes
              to the nft landscape. something easy, yet complex. something
              boring, yet amusing. take a look at{" "}
              <Link
                isExternal
                href={OPENSEA_COLLECTION_URL}
                textDecoration="underline"
                color="#2081e2"
              >
                OpenSea
              </Link>{" "}
              to see what has been minted so far
            </Text>
            <Text mb="2">
              the art is generated on <Text as="i">the chain</Text> by sampling
              data based on the state of <Text as="i">the chain</Text>, as well
              as data about the minter (you). there are a total of{" "}
              {COLOR_COUNT ** PART_COUNT} permutations ({COLOR_COUNT} colors and{" "}
              {PART_COUNT} parts,{" "}
              <Text as="i">
                n<Text as="sup">r</Text>
              </Text>
              ), so the chance of your future Shaep being unique is{" "}
              <Text as="em">good</Text>
            </Text>
            <Text mb="2">some things that are good to know:</Text>
            <UnorderedList listStyleType="square" pl="4" mb="4">
              <ListItem>
                there will be a total of {maxSupply ?? "?"} Shaeps that can be
                minted.
              </ListItem>
              <ListItem>
                the cost of one Shaep will be {formattedPrice} $MATIC
              </ListItem>
              <ListItem>
                the image to the left is just a showcase of what Shaeps can look
                like. it&apos;s not a preview of how the minted Shaep will look
              </ListItem>
            </UnorderedList>
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
            {(!isReady || !allMinted) && (
              <Box>
                <MintForm
                  onMint={() => onMint()}
                  isLoading={mintState === MintState.Loading}
                />
              </Box>
            )}
            {allMinted && isReady && (
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
