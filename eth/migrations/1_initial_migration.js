const deployInfo = require('../helpers/deployInfo');
const Migrations = artifacts.require('./Migrations.sol');

module.exports = async deployer => {
  await deployer.deploy(Migrations);
  deployInfo(deployer, Migrations);
};
