import {
  FormControl,
  FormLabel,
  Flex,
  NumberInput,
  NumberInputField,
  Button,
  FormHelperText,
} from "@chakra-ui/react";
import { useState, FormEvent } from "react";

type MintFormProps = {
  minted: number;
  totalSupply: number;
};

export function MintForm({ minted, totalSupply }: MintFormProps) {
  const [amount, setAmount] = useState<number | undefined>();

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    // TODO: mint NFT
  }

  function handleChange(_: string, value: number) {
    setAmount(Number.isInteger(value) ? value : undefined);
  }

  return (
    <form onSubmit={handleSubmit}>
      <FormControl w={["100%", "50%", "unset"]} mb="2">
        <FormLabel htmlFor="amount">amount</FormLabel>
        <Flex>
          <NumberInput
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
          </NumberInput>
          <Button
            color="white"
            bg="black"
            borderRadius="0"
            lineHeight="2"
            type="submit"
          >
            mint
          </Button>
        </Flex>
        <FormHelperText fontSize="sm">
          {minted}/{totalSupply} ({((minted / totalSupply) * 100).toFixed(0)} %)
          minted
        </FormHelperText>
      </FormControl>
    </form>
  );
}
