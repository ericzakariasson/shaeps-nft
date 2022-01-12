// SPDX-License-Identifier: MIT
pragma solidity ^0.8.2;

import "hardhat/console.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/utils/Strings.sol";
import {Base64} from "./libraries/Base64.sol";

/// @custom:security-contact security@shaeps.xyz
contract Shaeps is ERC721, ERC721URIStorage, Ownable {
    using Counters for Counters.Counter;

    Counters.Counter private _tokenIds;

    uint256 public constant MAX_SUPPLY = 10_000;
    uint256 public constant PRICE = 0.001 ether;

    string[9] palette = [
        "#EB5757",
        "#F2994A",
        "#F2C94C",
        "#6FCF97",
        "#56CCF2",
        "#2F80ED",
        "#9B51E0",
        "#FFF",
        "#111"
    ];

    constructor() ERC721("Shaeps", "SHAEPS") {}

    function debug() public view returns (uint256[6] memory) {
        uint256 seed = uint256(keccak256(abi.encodePacked(msg.sender)));
        bytes memory hash = abi.encodePacked(bytes32(seed));

        return generateColors(hash);
    }

    function generateColors(bytes memory hash)
        internal
        pure
        returns (uint256[6] memory)
    {
        uint256[6] memory colors;
        for (uint256 i = 0; i < 6; i++) {
            colors[i] = toUint8(hash, i) % 9;
        }
        return colors;
    }

    function generateSvg(uint256 tokenId) public view returns (string memory) {
        bytes memory hash = abi.encodePacked(
            keccak256(abi.encodePacked(tokenId))
        );
        uint256[6] memory colors = generateColors(hash);

        return
            string(
                abi.encodePacked(
                    "data:image/svg+xml;base64,",
                    Base64.encode(
                        bytes(
                            string(
                                abi.encodePacked(
                                    '<svg viewBox="0 0 388 388" xmlns="http://www.w3.org/2000/svg">',
                                    '<path d="M0 0h194v388H0z" shapeRendering="crispEdges" fill="',
                                    palette[colors[0]],
                                    '"/>'
                                    '<path d="M194 0h194v388H194z" shapeRendering="crispEdges" fill="',
                                    palette[colors[1]],
                                    '" />',
                                    '<path d="M97 193.75c0 53.434 43.566 96.75 97 96.75v-96.75H97Z" fill="',
                                    palette[colors[2]],
                                    '" />',
                                    '<path d="M69 69h125v125H69z" shapeRendering="crispEdges" fill="',
                                    palette[colors[3]],
                                    '" />',
                                    '<path d="M97 194v-.25C97 140.316 140.316 97 193.75 97s96.75 43.316 96.75 96.75v.25H97Z" fill="',
                                    palette[colors[4]],
                                    '" />',
                                    '<path d="M194 290.5V194h48v96.5h-48Z" shapeRendering="crispEdges" fill="',
                                    palette[colors[5]],
                                    '" />',
                                    "</svg>"
                                )
                            )
                        )
                    )
                )
            );
    }

    function generateMetadata(uint256 tokenId)
        public
        view
        returns (string memory)
    {
        string memory name = string(
            abi.encodePacked("Shaep #", Strings.toString(tokenId))
        );
        string memory description = "rectangles and circles";
        string memory svg = generateSvg(tokenId);
        // TODO: attributes and traits

        return
            string(
                abi.encodePacked(
                    "data:application/json;base64,",
                    Base64.encode(
                        bytes(
                            abi.encodePacked(
                                '{"name":"',
                                name,
                                '", "description":"',
                                description,
                                '", "image": "',
                                svg,
                                '"}'
                            )
                        )
                    )
                )
            );
    }

    function safeMint(address to, string memory uri) public onlyOwner {
        uint256 tokenId = _tokenIds.current();
        _tokenIds.increment();
        _safeMint(to, tokenId);
        _setTokenURI(tokenId, uri);
    }

    // The following functions are overrides required by Solidity.

    function _burn(uint256 tokenId)
        internal
        override(ERC721, ERC721URIStorage)
    {
        super._burn(tokenId);
    }

    function tokenURI(uint256 tokenId)
        public
        view
        override(ERC721, ERC721URIStorage)
        returns (string memory)
    {
        return super.tokenURI(tokenId);
    }

    /// @custom:source https://github.com/GNSPS/solidity-bytes-utils/blob/master/contracts/BytesLib.sol
    function toUint8(bytes memory _bytes, uint256 _start)
        internal
        pure
        returns (uint8)
    {
        require(_bytes.length >= _start + 1, "toUint8_outOfBounds");
        uint8 tempUint;

        assembly {
            tempUint := mload(add(add(_bytes, 0x1), _start))
        }

        return tempUint;
    }
}
