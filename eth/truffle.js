const HDWalletProvider = require('truffle-hdwallet-provider');

const mnemonic = process.env.MNEMONIC;
const infuraId = process.env.INFURA_ID || '';

module.exports = {
  // See <http://truffleframework.com/docs/advanced/configuration>
  // to customize your Truffle configuration!
  networks: {
    // truffle develop
    develop: {
      host: '127.0.0.1',
      port: 9545,
      network_id: '4777',
    },
    // Ganache GUI
    development: {
      host: '127.0.0.1',
      port: 7545,
      network_id: '5777',
    },
    // ganache_cli
    ganache_cli: {
      host: '127.0.0.1',
      port: 8545,
      network_id: '5778',
    },
    // rinkeby
    rinkeby: {
      provider: () =>
        new HDWalletProvider(mnemonic, `https://rinkeby.infura.io/${infuraId}`),
      network_id: 4,
    },
    // live Ethereum network
    live: {
      provider: () =>
        new HDWalletProvider(mnemonic, `https://mainnet.infura.io/${infuraId}`),
      network_id: 1,
    },
  },
};
