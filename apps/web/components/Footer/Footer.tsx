import { Flex, Spacer, Link, Text } from "@chakra-ui/react";

export function Footer() {
  const contractAddress = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS;
  const collectionName = process.env.NEXT_PUBLIC_COLLECTION_NAME;

  return (
    <Flex as="footer" direction={["column", "column", "row"]} mt="auto">
      <Flex>
        <Link isExternal href="https://twitter.com/ericzakariasson">
          twitter
        </Link>
        <Text mx="2">—</Text>
        <Link isExternal href="https://github.com/ericzakariasson/shaeps-nft">
          github
        </Link>
        <Text mx="2">—</Text>
        <Link
          isExternal
          href={`https://opensea.io/collection/${collectionName}/`}
        >
          opensea
        </Link>
      </Flex>
      <Spacer />
      <Link
        isExternal
        href={`https://polygonscan.com/token/${contractAddress}`}
        color="gray"
        fontSize="sm"
        mt={["4", "4", "0"]}
      >
        {contractAddress}
      </Link>
    </Flex>
  );
}
