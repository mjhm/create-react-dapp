import Promise from 'bluebird';
import axios from 'axios';
import getWeb3 from './getWeb3';

// General purpose utility for setting up web3 contract instances.
// It fetches the contract info files which includes the abi, address
// and network location, connects to a web3 provider and instantiates
// the contracts.
const fetchContracts = async (network, contractNames) => {
  const contracts = {};
  let localWeb3 = null;

  await Promise.map(contractNames, async name => {
    let contractInfo = null;
    try {
      contractInfo = await axios.get(`contract-info/${name}.json`);
    } catch (err) {
      if (err.response && err.response.status === 404) {
        throw new Error(`Couldn't find info file "contract-info/${name}.json". \
Perhaps you haven't run migrations for contract "${name}" yet, \
or the migrations aren't calling the "deployInfo" function.`);
      }
      throw err;
    }
    if (!localWeb3) {
      const { networkLocation } = contractInfo.data[network];
      localWeb3 = await getWeb3(networkLocation);
    }

    const { abi, address } = contractInfo.data[network];
    const contract = localWeb3.eth.Contract
      ? new localWeb3.eth.Contract(abi, address) // web3 1.X
      : localWeb3.eth.contract(abi).at(address); // web3 0.20.X
    contracts[name] = contract;
    return contractInfo;
  });
  return { contracts };
};

export default fetchContracts;
