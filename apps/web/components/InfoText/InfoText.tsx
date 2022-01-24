import { UnorderedList, ListItem, Text, Link } from "@chakra-ui/react";
import { ethers } from "ethers";
import { OPENSEA_COLLECTION_URL } from "../../constants/urls";

const COLOR_COUNT = 9;
const PART_COUNT = 6;

type InfoTextProps = {
  price: number | null;
  maxSupply: number | null;
};

export function InfoText({ price, maxSupply }: InfoTextProps) {
  const formattedPrice = ethers.utils.formatEther(price ?? 0);

  return (
    <>
      <Text mb="2">
        this project was created to bring some simple and elegant shapes to the
        nft landscape. something easy, yet complex. something boring, yet
        amusing. take a look at{" "}
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
        the art is generated on <Text as="i">the chain</Text> by sampling data
        based on the state of <Text as="i">the chain</Text>, as well as data
        about the minter (you). there are a total of {COLOR_COUNT ** PART_COUNT}{" "}
        permutations ({COLOR_COUNT} colors and {PART_COUNT} parts,{" "}
        <Text as="i">
          n<Text as="sup">r</Text>
        </Text>
        ), so the chance of your future Shaep being unique is{" "}
        <Text as="em">good</Text>
      </Text>
      <Text mb="2">some things that are good to know:</Text>
      <UnorderedList listStyleType="square" pl="4" mb="4">
        <ListItem>
          there will be a total of {maxSupply ?? "?"} Shaeps that can be minted.
        </ListItem>
        <ListItem>
          the cost of one Shaep will be {formattedPrice} $MATIC
        </ListItem>
        <ListItem>
          the image to the left is just a showcase of what Shaeps can look like.
          it&apos;s not a preview of how the minted Shaep will look
        </ListItem>
      </UnorderedList>
    </>
  );
}
