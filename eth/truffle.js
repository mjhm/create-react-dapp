module.exports = {
  // See <http://truffleframework.com/docs/advanced/configuration>
  // to customize your Truffle configuration!
  networks: {
    // truffle develop
    develop: {
      host: 'localhost',
      port: 9545,
      network_id: '4777',
    },
    // Ganache GUI
    development: {
      host: 'localhost',
      port: 7545,
      network_id: '5777',
    },
    // ganache_cli
    ganache_cli: {
      host: 'localhost',
      port: 8545,
      network_id: '5778',
    },
  },
};
