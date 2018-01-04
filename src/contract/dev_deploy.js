const ganache = require('ganache-cli');
const Web3 = require('web3');
const deploy = require('./deploy');
const _ = require('lodash');

const port = 8545;
const provider = new Web3.providers.HttpProvider(`http://localhost:${port}`);

var server = ganache.server();

server.listen(port, null, async err => {
  if (err) {
    throw err;
  }
  // This is the accounts list coming from the ganache server.
  // Note that the server.provider here is a completely different object
  // than the provider above.
  const accounts = _.keys(_.get(server, 'provider.manager.state.accounts', {}));

  if (!accounts.length) {
    throw new Error('no valid accounts');
  }

  console.info(`ganache server listening on ${port}`);
  await deploy(provider, accounts[0]);
});
