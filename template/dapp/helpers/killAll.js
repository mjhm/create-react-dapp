/* global web3 */
const fs = require('fs');
const Promise = require('bluebird');

const getNetwork = Promise.promisify(web3.version.getNetwork).bind(
  web3.version,
);
const getAccounts = Promise.promisify(web3.eth.getAccounts).bind(web3.eth);
const getCode = Promise.promisify(web3.eth.getCode).bind(web3.eth);
const waitForLatestBlock = Promise.promisify(web3.eth.filter).bind(
  web3.eth,
  'latest',
);

const killAll = async () => {
  const network = await getNetwork();
  const contractDir = `${__dirname}/../build/contracts`;
  const contractList = fs.readdirSync(contractDir);
  const accounts = await getAccounts();
  if (accounts.length === 0) {
    throw new Error('No accounts');
  }
  web3.eth.defaultAccount = accounts[0];
  await Promise.map(contractList, async contractFile => {
    if (!contractFile.match(/\.json$/)) return null;
    const contractInfo = require(`${contractDir}/${contractFile}`);
    const { contractName, networks, abi } = contractInfo;
    if (!networks[network]) return null;
    const { address } = networks[network];
    const code = await getCode(address);
    const warnPrefix = `Contract ${contractName} on network ${network}`;
    if (code === '0x0') {
      return console.warn(`${warnPrefix} isn't deployed.`);
    }
    const contract = web3.eth.contract(abi).at(address);
    if (!contract.kill) {
      return console.warn(`${warnPrefix} doesn't have a "kill" method.`);
    }
    await Promise.promisify(contract.kill.sendTransaction)();
    await waitForLatestBlock();
    console.info(`Killed ${contractInfo.contractName}`);
  });
};

module.exports = callback => {
  killAll().then(callback.bind(null, 'Completed killAll'), callback);
};
