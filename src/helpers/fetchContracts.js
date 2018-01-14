import Promise from 'bluebird';

const fetchContracts = async (web3, contractNames) => {
  const contracts = {};
  await Promise.map(contractNames, async name => {
    const contractInfo = await (await fetch(
      `contract-info/${name}.json`,
    )).json();
    console.log('web3', web3);

    const contract = new web3.eth.Contract(
      contractInfo.abi,
      // '0x627306090abaB3A6e1400e9345bC60c78a8BEf57',
      contractInfo.networks['5777'].address,
    );
    contracts[name] = contract;
    return contract;
  });
  return contracts;
};

export default fetchContracts;
