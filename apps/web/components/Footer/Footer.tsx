import { Flex, Spacer, Link, Text } from "@chakra-ui/react";
import {
  BLOCKCHAIN_EXPLORER_BASE_URL,
  CONTRACT_ADDRESS,
  OPENSEA_COLLECTION_URL,
} from "../../constants/urls";

export function Footer() {
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
        <Link isExternal href={OPENSEA_COLLECTION_URL}>
          opensea
        </Link>
      </Flex>
      <Spacer />
      <Link
        isExternal
        href={`${BLOCKCHAIN_EXPLORER_BASE_URL}/token/${CONTRACT_ADDRESS}`}
        color="gray"
        fontSize="sm"
        mt={["4", "4", "0"]}
      >
        {CONTRACT_ADDRESS}
      </Link>
    </Flex>
  );
}
