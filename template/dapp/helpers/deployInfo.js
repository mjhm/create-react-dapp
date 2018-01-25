const fs = require('fs');
const _ = require('lodash');
const truffleConfig = require('../truffle.js');
const mkdirp = require('mkdirp');

const deployInfo = (deployer, contract) => {
  const { network_id } = deployer;
  const {
    contractName,
    abi,
    compiler,
    networks,
    schemaVersion,
    updatedAt,
  } = _.cloneDeep(contract.toJSON());
  const infoDir = `${__dirname}/../../public/contract-info`;
  mkdirp.sync(infoDir);
  const infoFile = `${infoDir}/${contractName}.json`;
  const info = { [network_id]: {} };
  if (fs.existsSync(infoFile)) {
    _.defaults(info, JSON.parse(fs.readFileSync(infoFile)));
  }
  _.assign(info[network_id], networks[network_id], {
    networkName: deployer.network,
    networkLocation: truffleConfig.networks[deployer.network],
    contractName,
    abi,
    compiler,
    schemaVersion,
    updatedAt,
  });
  // networks[network_id].networkName = deployer.network;
  // networks[network_id].networkLocation =
  //   truffleConfig.networks[deployer.network];
  fs.writeFileSync(infoFile, JSON.stringify(info, null, 2));
};

module.exports = deployInfo;
