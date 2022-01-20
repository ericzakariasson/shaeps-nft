import {
  FormControl,
  FormLabel,
  Flex,
  NumberInput,
  NumberInputField,
  Button,
  Box,
  FormHelperText,
} from "@chakra-ui/react";
import { useState, FormEvent } from "react";

type MintFormProps = {
  mintedSupply: number;
  totalSupply: number;
  onMint: (amount: number) => void;
};

export function MintForm({ mintedSupply, totalSupply, onMint }: MintFormProps) {
  const [amount, setAmount] = useState<number | undefined>();

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    onMint(amount);
  }

  // function handleChange(_: string, value: number) {
  //   setAmount(Number.isInteger(value) ? value : undefined);
  // }

  // const percentageMinted = ((mintedSupply / totalSupply) * 100).toFixed(0);

  return (
    <form onSubmit={handleSubmit}>
      <FormControl>
        {/* <FormLabel htmlFor="amount">amount</FormLabel> */}
        <Flex>
          {/* <NumberInput
            mr="2"
            flex={[1, "unset", "unset"]}
            min={0}
            max={totalSupply - minted}
            value={amount ?? ""}
            onChange={handleChange}
          >
            <NumberInputField
              borderRadius="0"
              id="amount"
              name="amount"
              placeholder="111"
              required
            />
          </NumberInput> */}
          <Button
            color="white"
            bg="black"
            _hover={{ bg: "black" }}
            borderRadius="0"
            lineHeight="2"
            type="submit"
            px="6"
            py="4"
          >
            mint
          </Button>
        </Flex>
      </FormControl>
    </form>
  );
}
