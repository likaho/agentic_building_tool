// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract AGEN is ERC20 {
  // Constructor to define token details
  constructor() ERC20('Agentic Protocol AI', 'AGEN') {
    _mint(msg.sender, 1000000000000000000000000000);
  }
}
 