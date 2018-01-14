const fs = require('fs');
const mkdirp = require('mkdirp');

const deployInfo = contract => {
  const {
    contractName,
    abi,
    compiler,
    networks,
    schemaVersion,
    updatedAt,
  } = contract.toJSON();
  const infoDir = `${__dirname}/../../public/contract-info`;
  mkdirp.sync(infoDir);
  fs.writeFileSync(
    `${infoDir}/${contractName}.json`,
    JSON.stringify(
      { contractName, abi, compiler, networks, schemaVersion, updatedAt },
      null,
      2,
    ),
  );
};

module.exports = deployInfo;
