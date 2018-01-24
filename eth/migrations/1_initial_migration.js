const deployInfo = require('../helpers/deployInfo');
const Migrations = artifacts.require('Migrations');

module.exports = async deployer => {
  await deployer.deploy(Migrations);
  return deployInfo(deployer, Migrations);
};
