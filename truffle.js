module.exports = {
  // See <http://truffleframework.com/docs/advanced/configuration>
  // to customize your Truffle configuration!
  // geth --rinkeby --rpc --rpcapi="personal,eth,network,web3,net" --ipcpath "~/AppData/Roaming/Ethereum/geth.ipc"
  // Address: {536565ee05b4cf4a4825eb67be0bc9a9697751ab}
  // geth attach http://127.0.0.1:8545
  // personal.unlockAccount(eth.accounts[0], null, 2400)
  // truffle migrate --reset --compile-all --network rinkeby
  // dappToken 0x4a815a591f6efd652986c0d44a79042df7696585
  // dappTokenSale 0x716ba5d2b2b1a89e60123d553f8f5dd4f4235a4b
  // var admin = eth.accounts[0]
  // var tokensAvailable = 750000
  
  // describe token to web3 - ABI
  // tell web3 the token address 

  networks: {
    development: {
      host: "127.0.0.1",
      port: "9545",
      network_id: "*"
    },
    rinkeby: {
      host: "localhost",
      port: 8545,
      network_id: 4,
      gas: 4700000
    }
  }
};
