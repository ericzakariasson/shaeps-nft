import {
  Box,
  Container,
  Flex,
  Heading,
  ListItem,
  Text,
  UnorderedList,
  Link,
} from "@chakra-ui/react";
import { Header } from "../components/Header";
import { Footer } from "../components/Footer";
import { MintForm } from "../components/MintForm";
import { Shaep } from "../components/Shaep";
import { MintState, useMintShaep } from "../hooks/useMintShaep/useMintShaep";
import { useRandomizedShaep } from "../hooks/useRandomizedShaep";
import { useShaepSupply } from "../hooks/useShaepSupply";
import { ethers } from "ethers";

function Main() {
  const { colors } = useRandomizedShaep({
    randomizedPartCount: 3,
    interval: 1000,
  });

  const { maxSupplyRequest, mintedSupplyRequest, priceRequest } =
    useShaepSupply();

  const contractAddress = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS;
  const maxSupply = maxSupplyRequest.data?.toNumber() ?? "?";
  const mintedSupply = mintedSupplyRequest.data?.toNumber() ?? "?";

  const price = priceRequest.data?.toNumber() ?? 0;
  const formattedPrice = ethers.utils.formatEther(price);

  const { mintState, onMint } = useMintShaep({
    price,
  });

  return (
    <Flex as="main" direction={["column", "column", "row"]} mb="8">
      <Box border="1px" flex="1" mr={["0", "0", "8"]} mb={["8", "8", "0"]}>
        <Shaep colors={colors} />
      </Box>
      <Flex flex="1" direction="column">
        <Box order={[1, 1, 0]} mb={["0", "0", "4"]}>
          <Heading as="h2" size="md" mb="2">
            what this is
          </Heading>
          <Text mb="2">
            this project was created to bring some simple and elegant shapes to
            the nft landscape. something easy, yet complex. something boring,
            yet enough. take a look at{" "}
            <Link
              isExternal
              href={`https://opensea.io/assets/matic/${contractAddress}`}
              textDecoration="underline"
              color="#2081e2"
            >
              OpenSea
            </Link>{" "}
            to see what has been minted so far
          </Text>
          <Text mb="2">
            the art is generated on <Text as="i">the chain</Text> by selecting
            colors based on your wallet address. there are a total of 531441
            permutations (9 colors and 6 parts,{" "}
            <Text as="i">
              n<Text as="sup">r</Text>
            </Text>
            ), so the chance of your future shaep being unique is{" "}
            <Text as="em">good</Text>
          </Text>
          <Text mb="2">some things that are good to know:</Text>
          <UnorderedList
            listStyleType="square"
            listStylePosition="inside"
            mb="4"
          >
            <ListItem>
              there will be a total of {maxSupply} Shaeps that can be minted.
            </ListItem>
            <ListItem>
              the cost of one Shaep will be {formattedPrice} $MATIC
            </ListItem>
          </UnorderedList>
        </Box>
        <Flex
          order={[0, 0, 1]}
          mb={[4, 4, 0]}
          mt={[0, 0, "auto"]}
          direction={["row", "row", "column"]}
          align={["end", "end", "unset"]}
          justify={["space-between", "space-between", "unset"]}
        >
          <Text fontSize="lg" mb={[0, 0, "2"]}>
            {mintedSupply}/{maxSupply} minted
          </Text>
          <Box>
            <MintForm
              onMint={() => onMint()}
              isLoading={mintState === MintState.Loading}
            />
          </Box>
        </Flex>
      </Flex>
    </Flex>
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
