import { Button, Flex, FormControl, FormHelperText } from "@chakra-ui/react";
import { FormEvent } from "react";
import { useConnect, useNetwork } from "wagmi";

type MintFormProps = {
  onMint: (amount: number) => void;
  isLoading: boolean;
};

export function MintForm({ onMint, isLoading }: MintFormProps) {
  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    onMint(1);
  }

  const [
    {
      data: { connected },
      loading,
    },
  ] = useConnect();

  const [
    {
      data: { chain },
    },
  ] = useNetwork();

  return (
    <form onSubmit={handleSubmit}>
      <FormControl>
        <Flex>
          <Button
            color="white"
            bg="black"
            _hover={{ bg: "black", opacity: 0.9 }}
            _active={{ bg: "black", opacity: 0.8 }}
            borderRadius="0"
            lineHeight="2"
            type="submit"
            px="8"
            py="4"
            disabled={!connected || chain?.unsupported}
            isLoading={isLoading}
          >
            mint
          </Button>
          {!connected && !loading ? (
            <FormHelperText ml="4" color="black" fontSize="sm">
              connect wallet to mint
            </FormHelperText>
          ) : null}
        </Flex>
      </FormControl>
    </form>
  );
}
