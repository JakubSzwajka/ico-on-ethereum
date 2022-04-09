// SPDX-License-Identifier: MIT
pragma solidity 0.5.5;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/crowdsale/Crowdsale.sol";

contract BonkTokenCrowdsale is Crowdsale {

    constructor(uint256 _rate, address payable _wallet, IERC20 _token)
    Crowdsale(_rate, _wallet, _token)
    public 
    {
        
    }

}