const Promise = require('bluebird');
const deployInfo = require('../helpers/deployInfo');
const Migrations = artifacts.require('Migrations');

module.exports = async deployer => {
  // const accounts = await Promise.promisify(web3.eth.getAccounts).call(web3.eth);
  // console.log('accounts', accounts);

  // const balance = await Promise.promisify(web3.eth.getBalance, {
  //   context: web3.eth,
  // })(accounts[0]);
  // console.log('balance', web3.fromWei(balance, 'gwei').toString());
  // console.log('HERE');
  // const gasPrice = await Promise.promisify(web3.eth.getGasPrice, {
  //   context: web3.eth,
  // })();
  // console.log('gasPrice', web3.fromWei(gasPrice, 'gwei').toString());
  // const lastBlock = await Promise.promisify(web3.eth.getBlock, {
  //   context: web3.eth,
  // })('latest');
  // console.log('lastBlock.gasLimit', lastBlock.gasLimit);
  try {
    await deployer.deploy(Migrations);
  } catch (err) {
    console.log('ERROR', err);
    throw err;
  }
  return deployInfo(deployer, Migrations);
};
