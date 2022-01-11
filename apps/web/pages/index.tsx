import {
  Box,
  Container,
  Flex,
  Heading,
  ListItem,
  Spacer,
  Text,
  UnorderedList,
} from "@chakra-ui/react";
import { Header } from "../components/Header";
import { MintForm } from "../components/MintForm";
import { Shaep } from "../components/Shaep";
import { useRandomizedShaep } from "../hooks/useRandomizedShaep";

const TOTAL_SUPPLY = 11111;
const AMOUNT_MINTED = 3545;

function Main() {
  const { colors } = useRandomizedShaep({
    randomizedPartCount: 3,
    interval: 1000,
  });

  return (
    <Flex
      as="main"
      direction={["column", "column", "row"]}
      alignItems={["unset", "unset", "flex-start"]}
    >
      <Box border="1px" flex="1" mr={["0", "0", "8"]} mb={["8", "8", "0"]}>
        <Shaep colors={colors} />
      </Box>
      <Flex flex="1" direction="column">
        <Box order={[1, 1, 0]} mb={["0", "0", "4"]}>
          <Heading as="h2" size="md" mb="2">
            what is this
          </Heading>
          <Text mb="2">
            so, what is this even? to answer shortly, don&apos;t know. some
            basic shapes and some basic colors.
          </Text>
          <Text mb="4">
            it was created as a counterweight to the current NFT landscape.
            something concrete, yet abstract. something boring, yet stylish
          </Text>
          <Text as="cite">
            You think it&apos;s funny to take screenshots of people&apos;s NFTs,
            huh? Property theft is a joke to you? I&apos;ll have you know that
            the blockchain doesn&apos;t lie. I own it. Even if you save it,
            it&apos;s my property. You are mad that you don&apos;t own the art
            that I own. Delete that screenshot.
          </Text>
        </Box>
        <Spacer />
        <Box order={[0, 0, 1]} mb={["8", "8", "0"]}>
          <Heading as="h2" size="md" mb="2">
            minting
          </Heading>
          <UnorderedList
            listStyleType="square"
            listStylePosition="inside"
            mb="4"
          >
            <ListItem>
              the aquistion cost for a shaep is 1 $MATIC + gas fees
            </ListItem>
            <ListItem>there are a total of {TOTAL_SUPPLY} shaeps</ListItem>
          </UnorderedList>
          <MintForm totalSupply={TOTAL_SUPPLY} minted={AMOUNT_MINTED} />
        </Box>
      </Flex>
    </Flex>
  );
}

export default function Index() {
  return (
    <Container maxW="container.lg" py={["4", "4", "16"]}>
      <Header />
      <Main />
    </Container>
  );
}
