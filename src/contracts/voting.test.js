/* eslint-env node, jest */
const ganache = require('ganache-cli');
const _ = require('lodash');
const Web3 = require('web3');
const deploy = require('./deploy');

const asciiToHex = Web3.utils.asciiToHex;

describe('Voting.sol', () => {
  let provider;
  let server;
  let accounts;
  let contract;

  beforeAll(async () => {
    const port = 8545;
    provider = new Web3.providers.HttpProvider(`http://localhost:${port}`);

    server = ganache.server();

    await new Promise((resolve, reject) => {
      server.listen(port, null, err => {
        if (err) {
          reject(err);
        }
        // This is the accounts list coming from the ganache server.
        // Note that the server.provider here is a completely different object
        // than the provider above.
        accounts = _.keys(_.get(server, 'provider.manager.state.accounts', {}));

        if (!accounts.length) {
          reject(new Error('no valid accounts'));
        }
      });
    });
  });

  afterAll(async () => {
    await new Promise(resolve => {
      server.close(resolve);
    });
  });

  beforeEach(async () => {
    contract = await deploy(provider, accounts[0]);
  });

  test('validCandidate success', async () => {
    const isRama = await contract.methods
      .validCandidate(asciiToHex('Rama'))
      .call();
    expect(isRama).toBeTruthy();
  });

  test('validCandidate failure', async () => {
    const isRam = await contract.methods
      .validCandidate(asciiToHex('Ram'))
      .call();
    expect(isRam).toBeFalsy();
  });

  test('totalVotesFor initial value', async () => {
    const joseVotes = await contract.methods
      .totalVotesFor(asciiToHex('Jose'))
      .call();
    // Note that the return value in web3 1.X is a string
    expect(parseInt(joseVotes, 10)).toEqual(0);
  });

  test('voteForCandidate simple', async () => {
    await contract.methods.voteForCandidate(asciiToHex('Jose')).send();
    const joseVotes = await contract.methods
      .totalVotesFor(asciiToHex('Jose'))
      .call();
    expect(parseInt(joseVotes, 10)).toEqual(1);
  });

  test.only('voteForCandidate 20 times', async () => {
    let i = 20;
    while (i--) {
      await contract.methods.voteForCandidate(asciiToHex('Jose')).send();
    }
    const joseVotes = await contract.methods
      .totalVotesFor(asciiToHex('Jose'))
      .call();
    expect(parseInt(joseVotes, 10)).toEqual(20);
  });
});
