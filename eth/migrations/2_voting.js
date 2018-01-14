const deployInfo = require('../helpers/deployInfo');
const Web3 = require('web3');
const Voting = artifacts.require('Voting');
const asciiToHex = Web3.utils.asciiToHex;

const candidates = ['Rama', 'Nick', 'Jose'];

module.exports = async deployer => {
  // deployment steps
  await deployer.deploy(Voting, candidates.map(asciiToHex));
  deployInfo(Voting);
};
