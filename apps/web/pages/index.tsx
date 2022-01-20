import {
  Box,
  Container,
  Flex,
  Heading,
  ListItem,
  Spacer,
  Text,
  UnorderedList,
  Link,
} from "@chakra-ui/react";
import { Header } from "../components/Header";
import { MintForm } from "../components/MintForm";
import { Shaep } from "../components/Shaep";
import { useRandomizedShaep } from "../hooks/useRandomizedShaep";
import { useShaepSupply } from "../hooks/useShaepSupply";

const TOTAL_SUPPLY = 111;
const AMOUNT_MINTED = 47;

function Main() {
  const { colors } = useRandomizedShaep({
    randomizedPartCount: 3,
    interval: 1000,
  });

  const { totalSupplyRequest, mintedSupplyRequest } = useShaepSupply();

  // const [{ data: account }] = useAccount();
  // const [signer, setSigner] = useState<Signer>();

  // // get signer
  // useEffect(() => {
  //   (async () => {
  //     try {
  //       const res = await account?.connector?.getSigner();
  //       setSigner(res);
  //     } catch (e) {
  //       setSigner(undefined);
  //     }
  //   })();
  // }, [account?.connector]);

  // const contract = useContract({
  //   addressOrName: CONTRACT_ADDRESS,
  //   contractInterface: shaepAbi.abi,
  //   signerOrProvider: signer,
  // });

  async function handleMint(amount: number) {
    console.log("will mint", amount);
    // const tx = await contract.safeMint(
    //   "0x9B46d5E5e96c3dD6fCb6DD7ccb4a5A049a7e5d31"
    // );
    // await tx.wait();

    // console.log("Minted", `https://rinkeby.etherscan.io/tx/${tx.hash}`);
  }

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
            what this is
          </Heading>
          <Text mb="2">
            this project was created to bring some simple and elegant shapes to
            the nft landscape. something easy, yet complex. something boring,
            yet enough. take a look at{" "}
            <Link
              isExternal
              href={`https://opensea.io/assets/matic/${process.env.NEXT_PUBLIC_CONTRACT_ADDRESS}`}
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
              there will be a total of {TOTAL_SUPPLY} Shaeps that can be minted.
            </ListItem>
            <ListItem>the cost of one Shaep will be 5 $MATIC</ListItem>
          </UnorderedList>
        </Box>
        <Spacer />
        <Flex
          order={[0, 0, 1]}
          mb={["4", "4", "0"]}
          direction={["row", "row", "column"]}
          align={["end", "end", "unset"]}
          justify={["space-between", "space-between", "unset"]}
        >
          <Text fontSize="lg" mb={[0, 0, "2"]}>
            {AMOUNT_MINTED}/{TOTAL_SUPPLY} minted
          </Text>
          <Box>
            <MintForm
              totalSupply={TOTAL_SUPPLY}
              mintedSupply={AMOUNT_MINTED}
              onMint={handleMint}
            />
          </Box>
        </Flex>
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
