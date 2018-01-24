const deployInfo = require('../helpers/deployInfo');
const Web3 = require('web3');
const Voting = artifacts.require('Voting');
const asciiToHex = (Web3.utils || {}).asciiToHex || Web3.prototype.fromAscii;
//                 ^^^ web3 1.x                     ^^^ web3 0.20.X

const candidates = ['Rama', 'Nick', 'Jose'];

module.exports = async deployer => {
  await deployer.deploy(Voting, candidates.map(asciiToHex));
  return deployInfo(deployer, Voting);
};
