const fs = require('fs');
const _ = require('lodash');
// vvv This is needed because something is clobbering the cached truffle config.
delete require.cache[require.resolve('../truffle.js')];
const truffleConfig = require('../truffle.js');
const mkdirp = require('mkdirp');

const deployInfo = (deployer, contract) => {
  const {
    contractName,
    abi,
    compiler,
    schemaVersion,
    updatedAt,
  } = contract.toJSON();
  const address = contract.address;
  const network_id = contract.network_id;
  const networkName = deployer.network;

  const infoDir = `${__dirname}/../../public/contract-info`;
  mkdirp.sync(infoDir);
  const infoFile = `${infoDir}/${contractName}.json`;

  const info = { [networkName]: {} };
  if (fs.existsSync(infoFile)) {
    _.defaults(info, JSON.parse(fs.readFileSync(infoFile)));
  }

  console.log('truffleConfig', truffleConfig.networks);

  const networkLocation = Object.assign(
    {},
    truffleConfig.networks[networkName],
    {
      network_id,
    },
  );

  info[networkName] = {
    networkName,
    networkLocation,
    contractName,
    abi,
    compiler,
    schemaVersion,
    updatedAt,
    address,
    network_id,
  };
  fs.writeFileSync(infoFile, JSON.stringify(info, null, 2));
};

module.exports = deployInfo;
