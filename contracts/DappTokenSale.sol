pragma solidity ^0.4.2;

import "./DappToken.sol";

contract DappTokenSale {

  address admin;
  DappToken public tokenContract;
  uint256 public tokenPrice;
  uint256 public tokenSold;

  event Sell(address _buyer, uint256 _amount);

  constructor(DappToken _tokenContract, uint256 _tokenPrice) public {
    // assign admin
    admin = msg.sender;
    // assign token Contract
    tokenContract = _tokenContract;
    // token Price
    tokenPrice = _tokenPrice;
  }

  // multiply
  function multiply(uint x, uint y) internal pure returns (uint z) {
        require(y == 0 || (z = x * y) / y == x);
  }

  function buyTokens(uint256 _numberOfTokens) public payable {
    // require that value is equal to tokens
     require(msg.value == multiply(_numberOfTokens, tokenPrice));
    // require that contract has enough tokens
    require(tokenContract.balanceOf(this) >= _numberOfTokens);
    // require that a transfer is successful
    require(tokenContract.transfer(msg.sender, _numberOfTokens));
    // keep track of number of tokens sold
    tokenSold += _numberOfTokens; 
    // trigger Sell Event
    emit Sell(msg.sender, _numberOfTokens);

  }


}