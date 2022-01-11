import { Menu, MenuButton, Button, MenuList, MenuItem } from "@chakra-ui/react";
import { Connector } from "wagmi";

type ConnectAccountProps = {
  connectors: Connector[];
  onConnect: (connector: Connector) => void;
};

export function ConnectAccount({ connectors, onConnect }: ConnectAccountProps) {
  return (
    <Menu placement="bottom-end">
      <MenuButton
        as={Button}
        bg="none"
        border="1px"
        borderRadius="0"
        lineHeight="2"
      >
        connect wallet
      </MenuButton>
      <MenuList borderRadius="0">
        {connectors
          .filter((connector) => connector.ready)
          .map((connector) => (
            <MenuItem
              _hover={{ textDecoration: "underline", bg: "none" }}
              _expanded={{ textDecoration: "underline", bg: "none" }}
              fontWeight="bold"
              key={connector.id}
              disabled={!connector.ready}
              onClick={() => onConnect(connector)}
            >
              {connector.name}
              {!connector.ready && " (unavailable)"}
            </MenuItem>
          ))}
      </MenuList>
    </Menu>
  );
}
