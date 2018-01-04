const Web3 = require('web3');
const solc = require('solc');
const fs = require('fs');

const deployFolder = `${__dirname}/../../public/deploy`;
if (!fs.existsSync(deployFolder)) {
  fs.mkdirSync(deployFolder);
}

const asciiToHex = Web3.utils.asciiToHex;

const candidates = ['Rama', 'Nick', 'Jose'];

const deploy = async (provider, account) => {
  const web3 = new Web3(provider);
  const code = fs.readFileSync(`${__dirname}/voting.sol`).toString();
  const compiledCode = solc.compile(code);
  const errors = [];
  const warnings = [];
  (compiledCode.errors || []).forEach(err => {
    if (/:\s*Warning:/.test(err)) {
      warnings.push(err);
    } else {
      errors.push(err);
    }
  });

  if (errors.length) {
    throw new Error('solc.compile: ' + errors.join('\n'));
  }
  if (warnings.length) {
    console.warn('solc.compile: ' + warnings.join('\n'));
  }
  const byteCode = compiledCode.contracts[':Voting'].bytecode;
  const abiDefinition = JSON.parse(compiledCode.contracts[':Voting'].interface);
  fs.writeFileSync(
    `${deployFolder}/abi_definition.js`,
    `ABI_DEFINITION = ${compiledCode.contracts[':Voting'].interface};`,
  );

  const VotingContract = new web3.eth.Contract(abiDefinition, {
    data: byteCode,
    from: account,
    gas: 4700000,
  });

  const deployedContract = await VotingContract.deploy({
    arguments: [candidates.map(asciiToHex)],
  }).send();

  // setProvider is needed here to work around https://github.com/ethereum/web3.js/issues/1253
  deployedContract.setProvider(provider);
  fs.writeFileSync(
    `${deployFolder}/contract_address.js`,
    `CONTRACT_ADDRESS = '${deployedContract.options.address}';`,
  );
  await deployedContract.methods.voteForCandidate(asciiToHex('Rama')).send();

  const votesRama = await deployedContract.methods
    .totalVotesFor(asciiToHex('Rama'))
    .call();
  console.info('votesRama', votesRama);
};

module.exports = deploy;
