pragma solidity ^0.4.2;

contract DappToken {

  uint256 public totalSupply;
  mapping(address => uint256) public balanceOf;
  string public name="DApp Token";
  string public symbol="DAPP";
  string public standard="DApp Token v1.0";
  
  event Transfer(
    address indexed _from,
    address indexed _to,
    uint256 _value
  );
  

  constructor(uint256 _initialSupply) public {
    // allocate initial supply 
    balanceOf[msg.sender] = _initialSupply;
    totalSupply = _initialSupply;
  }

  // Transfer
  function transfer(address _to, uint256 _value) public returns(bool success) {
    // Exception if accoutn doesn' t have enough
    require(balanceOf[msg.sender] >= _value);
    // Transfer the balance
    balanceOf[msg.sender] -= _value;
    balanceOf[_to] += _value;
    // Transfer Event
    emit Transfer(msg.sender, _to, _value);
    
    return true;

  }

  
}