// SPDX-License-Identifier: MIT
pragma solidity 0.5.5;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/crowdsale/Crowdsale.sol";
import "@openzeppelin/contracts/crowdsale/emission/MintedCrowdsale.sol"; 
import "@openzeppelin/contracts/crowdsale/validation/CappedCrowdsale.sol"; 
import "@openzeppelin/contracts/crowdsale/validation/TimedCrowdsale.sol"; 
import "@openzeppelin/contracts/crowdsale/validation/WhitelistCrowdsale.sol"; 


// min amount of investor contribution - 0.002 Ether
// max amount of investor contribution - 50 Ether

contract BonkTokenCrowdsale is 
    Crowdsale, 
    MintedCrowdsale, 
    CappedCrowdsale, 
    TimedCrowdsale,
    WhitelistCrowdsale
    {


    uint256 public investorMinCap = 2000000000000000; // 0.002 ETH
    uint256 public investorHardCap = 50000000000000000000; // 50 ETH

    mapping(address => uint256) public contributions; 

    constructor(
        uint256 _rate, 
        address payable _wallet, 
        IERC20 _token,
        uint256 _cap,
        uint256 _openingTime, 
        uint256 _closingTime
    )
    Crowdsale(_rate, _wallet, _token)
    CappedCrowdsale(_cap)
    TimedCrowdsale(_openingTime, _closingTime)
    public 
    {
    }
    /**
    * @dev Returns the amout contributed so far by a specific user.
    * @param _beneficiary Address of contributor
    * @return User_contribution so far
     */
    function getUserContribution(address _beneficiary)
        public view returns (uint256)
    {
        return contributions[_beneficiary];
    }

    /**
    * @dev Extended parent bahaviour requiring purchase to respect investor min/max founding cap. 
    * @param _beneficiary Token purchaser
    * @param _weiAmount Amount of-wei contributed
     */
    function _preValidatePurchase(
        address _beneficiary, 
        uint256 _weiAmount
    )
        internal view
    {
        super._preValidatePurchase(_beneficiary, _weiAmount);
        uint256 _existingContribution = contributions[_beneficiary];
        uint256 _newContribution = _existingContribution.add(_weiAmount);

        require(_newContribution >= investorMinCap, 'Total contribution too low');
        require(_newContribution <= investorHardCap, 'Total contribution exceeded');
    }

    function _updatePurchasingState(
        address _beneficiary, 
        uint256 _weiAmount
    ) 
        internal
    {
        contributions[_beneficiary] += _weiAmount; 
    }
}