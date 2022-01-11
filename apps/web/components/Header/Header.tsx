import { Box, Button, Flex, Heading, Spacer, Text } from "@chakra-ui/react";

export function Header() {
  return (
    <Box mb={["4", "4", "12"]}>
      <Flex mb="2">
        <Box>
          <Heading size="2xl" fontWeight="normal">
            shaeps
          </Heading>
        </Box>
        <Spacer />
        <Button bg="none" border="1px" borderRadius="0" lineHeight="2">
          connect wallet
        </Button>
      </Flex>
      <Text>just some rectangles and circles, probably shaeps</Text>
    </Box>
  );
}
