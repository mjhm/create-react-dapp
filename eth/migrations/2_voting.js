const Promise = require('bluebird');
const deployInfo = require('../helpers/deployInfo');
const Web3 = require('web3');
const Voting = artifacts.require('Voting');
const asciiToHex = (Web3.utils || {}).asciiToHex || Web3.prototype.fromAscii;
//                 ^^^ web3 1.x                     ^^^ web3 0.20.X

const candidates = ['Rama', 'Nick', 'Jose'];

module.exports = async deployer => {
  // const accounts = await Promise.promisify(web3.eth.getAccounts).call(web3.eth);
  // console.log('accounts', accounts);

  // const balance = await Promise.promisify(web3.eth.getBalance, {
  //   context: web3.eth,
  // })(accounts[0]);
  // console.log('balance', balance);
  await deployer.deploy(Voting, candidates.map(asciiToHex));
  return deployInfo(deployer, Voting);
};
