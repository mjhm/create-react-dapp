const fs = require('fs');
const ganache = require('ganache-cli');
const _ = require('lodash');
const Web3 = require('web3');
const deploy = require('./deploy');

const deployFolder = `${__dirname}/../../public/deploy`;
if (!fs.existsSync(deployFolder)) {
  fs.mkdirSync(deployFolder);
}

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
  const deployedContract = await deploy(provider, accounts[0]);
  fs.writeFileSync(
    `${deployFolder}/abi_definition.js`,
    `ABI_DEFINITION = ${JSON.stringify(
      deployedContract.options.jsonInterface,
    )}`,
  );
  fs.writeFileSync(
    `${deployFolder}/contract_address.js`,
    `CONTRACT_ADDRESS = '${deployedContract.options.address}';`,
  );
});
