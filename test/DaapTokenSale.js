var DappToken = artifacts.require("./DappToken.sol")
var DappTokenSale = artifacts.require("./DappTokenSale.sol")

contract('DappTokenSale', function(accounts){
  var tokenInstance
  var tokenSaleInstance
  var admin = accounts[0]
  var buyer = accounts[1]
  var tokenPrice = 1000000000000000  // in wei
  var tokensAvailable = 750000
  var numberOfTokens;


  it('initilizes the contract', function(){
    return DappTokenSale.deployed().then(function(instance){
      tokenSaleInstance = instance
      // heart beat
      return tokenSaleInstance.address
    }).then(function(address){
      assert.notEqual(address, 0x0, 'has contract address')
      return tokenSaleInstance.tokenContract()
    }).then(function(address){
      assert.notEqual(address, 0x0, 'has token contract address')
      return tokenSaleInstance.tokenPrice()
    }).then(function(price) {
      assert(price, tokenPrice, 'tokenPrice is correct')
    });
  })

  it('facilitates token buying', function(){
    return DappToken.deployed().then(function(instance){
      // grab token instance first
      tokenInstance = instance
      return DappTokenSale.deployed()
    }).then(function(instance) {
      // grab token sale instance first
      tokenSaleInstance = instance
      // provision 75% of all tokens to token sale
      return tokenInstance.transfer(tokenSaleInstance.address, tokensAvailable, {from: admin})
    }).then(function(receipt){      
      numberOfTokens = 10
      return tokenSaleInstance.buyTokens(numberOfTokens, { from: buyer, value: numberOfTokens * tokenPrice})
    }).then(function(receipt){
      assert.equal(receipt.logs.length, 1, 'triggers one event')
      assert.equal(receipt.logs[0].event, 'Sell', 'should be "Sell" event')
      assert.equal(receipt.logs[0].args._buyer, buyer, 'logs the account that purchased the coins')
      assert.equal(receipt.logs[0].args._amount, numberOfTokens, 'logs the number of tokens purchased')
      return tokenSaleInstance.tokenSold()
    }).then(function(amount){
      assert.equal(amount.toNumber(), numberOfTokens, 'increments the number of tokens sold')
      return tokenInstance.balanceOf(buyer)
    }).then(function(balance){
      assert.equal(balance, numberOfTokens)
      return tokenInstance.balanceOf(tokenSaleInstance.address)
    }).then(function(balance){
      assert.equal(balance, tokensAvailable - numberOfTokens)
      // try to buy tokens different from the ether value
      return tokenSaleInstance.buyTokens(numberOfTokens, { from: buyer, value: 1 })
    }).then(assert.fail).catch(function(error) {
      assert(error.message.indexOf('revert') >=0, 'msg.value must be equal number of tokens in wei')
      return tokenSaleInstance.buyTokens(800000, { from: buyer, value: numberOfTokens * tokenPrice })
    }).then(assert.fail).catch(function(error) {
      assert(error.message.indexOf('revert') >=0, 'cannnot purchase more tokens than available')
    })
  })

  it('ends token sale', function() {
    return DappToken.deployed().then(function(instance){
      // grab token instance first
      tokenInstance = instance
      return DappTokenSale.deployed()
    }).then(function(instance) {
      // grab token sale instance first
      tokenSaleInstance = instance
      // try to end sale (not the admin)
      return tokenSaleInstance.endSale({ from: buyer })
    }).then(assert.fail).catch(function(error) {
      assert(error.message.indexOf('revert') >=0, 'must be admin')
      return tokenSaleInstance.endSale({ from: admin })
    }).then(function(receipt){
      return tokenInstance.balanceOf(admin)
    }).then(function(balance){
      assert.equal(balance.toNumber(), 999990, 'return all the unsold tokens to admin')
      // check that token price was reset when suicide
      return tokenSaleInstance.tokenPrice()  
    }).then(function(price){
      assert.equal(price.toNumber(), 0, 'token price was reset')
    })  
            
  });

})

