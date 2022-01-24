// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "hardhat/console.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Burnable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/utils/Strings.sol";
import "@openzeppelin/contracts/utils/Address.sol";
import {Base64} from "./libraries/Base64.sol";

/// @custom:security-contact security@shaeps.xyz
contract Shaeps is ERC721, ERC721URIStorage, ERC721Burnable, Ownable {
    using Counters for Counters.Counter;

    Counters.Counter private _tokenIds;

    uint256 public constant maxSupply = 111;
    uint256 public constant price = 0.001 ether;

    address payable public collector;

    // map tokenId to generated hash
    mapping(uint256 => bytes) private tokenIdHash;

    event Minted(address to, uint256 tokenId);

    string[9] palette = [
        "#EB5757", // red
        "#F2994A", // orange
        "#F2C94C", // yellow
        "#6FCF97", // green
        "#56CCF2", // light blue
        "#2F80ED", // blue
        "#9B51E0", // purple
        "#FFF", // white
        "#111" // black
    ];

    string[9] colorNames = [
        "Red",
        "Orange",
        "Yellow",
        "Green",
        "Light Blue",
        "Blue",
        "Purple",
        "White",
        "Black"
    ];

    constructor(
        string memory _name,
        string memory _symbol,
        address payable _collector
    ) ERC721(_name, _symbol) {
        collector = _collector;
    }

    function mintedSupply() public view returns (uint256) {
        return _tokenIds.current();
    }

    function generateColorIndexes(bytes memory hash)
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

    function generateSvgWithColors(uint256[6] memory colors)
        internal
        view
        returns (string memory)
    {
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

    function generateSvg(uint256 tokenId) public view returns (string memory) {
        uint256[6] memory colors = generateColorIndexes(tokenIdHash[tokenId]);
        return generateSvgWithColors(colors);
    }

    function createTrait(string memory traitType, string memory value)
        internal
        pure
        returns (string memory)
    {
        return
            string(
                abi.encodePacked(
                    '{"trait_type":"',
                    traitType,
                    '", "value":"',
                    value,
                    '"}'
                )
            );
    }

    function generateAttributes(uint256[6] memory colorIndexes)
        internal
        view
        returns (string memory)
    {
        uint256[9] memory colorCount;

        for (uint256 i = 0; i < colorIndexes.length; i++) {
            uint256 colorIndex = colorIndexes[i];
            colorCount[colorIndex] += 1;
        }

        string memory traits;

        uint256 totalColorCount = 0;

        for (uint256 i = 0; i < colorCount.length; i++) {
            if (colorCount[i] > 0) {
                totalColorCount++;
                traits = string(
                    abi.encodePacked(
                        traits,
                        createTrait(
                            colorNames[i],
                            Strings.toString(colorCount[i])
                        ),
                        ","
                    )
                );
            }
        }

        traits = string(
            abi.encodePacked(
                traits,
                createTrait("Colors", Strings.toString(totalColorCount))
            )
        );

        return string(abi.encodePacked("[", traits, "]"));
    }

    function generateMetadata(uint256 tokenId)
        public
        view
        returns (string memory)
    {
        string memory name = string(
            abi.encodePacked("Shaep #", Strings.toString(tokenId + 1))
        );
        string memory description = string(
            abi.encodePacked(
                "a collection of lines and colors composed to ",
                Strings.toString(maxSupply),
                " shapes"
            )
        );

        bytes memory hash = tokenIdHash[tokenId];
        uint256[6] memory colorIndexes = generateColorIndexes(hash);
        string memory svg = generateSvgWithColors(colorIndexes);

        string memory attributes = generateAttributes(colorIndexes);

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
                                '", "attributes":',
                                attributes,
                                "}"
                            )
                        )
                    )
                )
            );
    }

    function generateHash(
        address to,
        uint256 timestamp,
        uint256 tokenId
    ) internal pure returns (bytes memory) {
        return
            abi.encodePacked(
                keccak256(abi.encodePacked(to, timestamp, tokenId))
            );
    }

    /// @dev withdraw funds to collector address
    function withdraw() public onlyOwner {
        // TODO: don't withdraw everything, store for airdrop
        Address.sendValue(collector, address(this).balance);
    }

    /// @notice Mints NFT to address
    /// @dev Mints NFT and generates metadata (including svg image) and store
    /// @param to address of the NFT receiver
    function mint(address to) public payable {
        uint256 tokenId = _tokenIds.current();
        require(tokenId + 1 <= maxSupply, "Max supply minted");
        require(msg.value >= price, "Insufficient funds provided");

        _safeMint(to, tokenId);
        tokenIdHash[tokenId] = generateHash(to, block.timestamp, tokenId);
        _setTokenURI(tokenId, generateMetadata(tokenId));
        emit Minted(to, tokenId);
        _tokenIds.increment();
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
