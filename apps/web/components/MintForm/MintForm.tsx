import { Button, Flex, FormControl, FormHelperText } from "@chakra-ui/react";
import { FormEvent } from "react";
import { useConnect } from "wagmi";

type MintFormProps = {
  onMint: (amount: number) => void;
};

export function MintForm({ onMint }: MintFormProps) {
  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    onMint(1);
  }

  const [
    {
      data: { connected },
    },
  ] = useConnect();

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
            px="6"
            py="4"
            disabled={!connected}
          >
            mint
          </Button>
        </Flex>
        {connected ? null : (
          <FormHelperText color="black" fontSize="sm">
            connect wallet to mint
          </FormHelperText>
        )}
      </FormControl>
    </form>
  );
}
