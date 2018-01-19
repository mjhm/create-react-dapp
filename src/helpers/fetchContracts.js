import Promise from 'bluebird';
import getWeb3 from './getWeb3';

const fetchContracts = async (network, contractNames) => {
  const contracts = {};
  let localWeb3 = null;
  let from = null;
  await Promise.map(contractNames, async name => {
    const contractInfo = await (await fetch(
      `contract-info/${name}.json`,
    )).json();
    if (!localWeb3) {
      const { networkLocation } = contractInfo[network];
      from = networkLocation.from;
      localWeb3 = await getWeb3(networkLocation);
    }
    const contract = new localWeb3.eth.Contract(
      contractInfo[network].abi,
      contractInfo[network].address,
    );
    contracts[name] = contract;
    return contractInfo;
  });
  return { from, contracts };
};

export default fetchContracts;
