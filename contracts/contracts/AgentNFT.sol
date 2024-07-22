// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";/**
 * This implements OpenZeppelin ERC721 defined in the EIP that adds
 * enumerability of all the token ids in the contract as well as all token ids owned by each
 * account.
 */
contract AgentNFT is ERC721 {

    // Struct Identifier definition
    struct Identifier {
        string agent_id;  // Agent ID
        string dataCID;     // IPFS CID (Content Identifier) for NFT data
        uint256 gas;
    }

    // Mapping to store Identifiers
    mapping(uint256 => Identifier) private identifiers;
    address private admin;
    string public baseURI;    
    // Minted event after a badge is minted
    event Minted(uint256 indexed _tokenId);

    modifier onlyAdmin() {
        require(msg.sender == admin, "Caller is not admin");
        _;
    }

    // Constructor to initialize ERC721 token
    constructor(string memory _name, string memory _symbol) ERC721(_name, _symbol) {
        admin = msg.sender;
        baseURI = "https://gateway.lighthouse.storage/ipfs/"; // Set your base URI for token metadata        
    }

    function getTokenURI(string memory _agent_id) external view returns(string memory) {
        string memory cid = identifiers[uint256(keccak256(abi.encode(_agent_id)))].dataCID;
        return string(abi.encodePacked(baseURI, cid));
    }

    function getGas(string memory _agent_id) external view returns(uint256) {
        uint256 gas = identifiers[uint256(keccak256(abi.encode(_agent_id)))].gas;
        return gas;
    }

    // Mint function to create a new token and associate it with an Identifier
    function mint(address owner, string memory _agent_id, string memory _dataCID, uint256 _gas) external {
        // Calculate the tokenId based on the dataCID
        require(bytes(_agent_id).length > 0, "Tool id cannot be an empty string.");
        require(bytes(_dataCID).length > 0, "dataCID cannot be an empty string.");
        uint256 tokenId = uint256(keccak256(abi.encode(_agent_id)));
        bytes memory cid = bytes(identifiers[tokenId].dataCID);
        if(cid.length > 0) {
            _burn(tokenId);
        } 
        // Mint the token and associate it with the sender's address
        _mint(owner, tokenId);
        // Store the Identifier in the mapping
        identifiers[tokenId] = Identifier(_agent_id, _dataCID, _gas);
        emit Minted(tokenId);
    }

    // Override the _baseURI function to return the base URI for the token metadata
    function _baseURI() internal view virtual override returns (string memory) {
        return baseURI;
    }

    function setBaseURI(string memory newURI) external onlyAdmin {
        baseURI = newURI;
    }
    
    // Burn function to destroy a token and remove its associated Identifier
    function burn(uint256 _tokenId) external {
        require(msg.sender == ownerOf(_tokenId) || admin == msg.sender, "ERC721: caller is not token owner or approved");
        _burn(_tokenId);
        delete identifiers[_tokenId];
    }

    function getTokenId(string memory _agent_id) external pure returns(uint256) {
        // Calculate the tokenId based on the dataCID
        require(bytes(_agent_id).length > 0, "Tool id cannot be an empty string.");
        uint256 tokenId = uint256(keccak256(abi.encode(_agent_id)));
        return tokenId;
    }
}