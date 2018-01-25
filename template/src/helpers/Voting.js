import Promise from 'bluebird';
import Web3 from 'web3';
import _ from 'lodash';

const { asciiToHex, hexToAscii } =
  // web3 1.X
  Web3.utils || {
    // web3 0.20.X
    asciiToHex: Web3.prototype.fromAscii,
    hexToAscii: Web3.prototype.toAscii,
  };

export default class Voting {
  constructor(contract) {
    this.contract = contract;

    const getCandidateList = Promise.promisify(
      this.contract.getCandidateList.call,
      { context: this.contract.getCandidateList },
    );
    const totalVotesFor = Promise.promisify(this.contract.totalVotesFor.call, {
      context: this.contract.totalVotesFor,
    });
    const voteForCandidate = Promise.promisify(
      this.contract.voteForCandidate.sendTransaction,
      { context: this.contract.voteForCandidate },
    );
    const getTransaction = Promise.promisify(
      this.contract._eth.getTransaction,
      { context: this.contract._eth },
    );

    this.methods = {
      getCandidateList,
      totalVotesFor,
      voteForCandidate,
      getTransaction,
    };
  }

  async waitForBlock(tx) {
    let elapsed = 0;
    let delay = 1000;
    while (elapsed < 10 * 60 * 1000) {
      let txObject = await this.methods.getTransaction(tx);
      if (txObject && txObject.blockNumber) {
        return txObject;
      } else {
        await Promise.delay(delay);
        elapsed = elapsed + delay;
        delay = Math.floor(1.5 * delay);
      }
    }
    throw new Error('Timed out waiting for votes to be recorded in a block.');
  }

  async initCandidateList() {
    const hexCandidateList = await this.methods.getCandidateList();
    return (this.candidateList = hexCandidateList.map(hexToAscii));
  }

  async voteForCandidate(name) {
    try {
      const tx = await this.methods.voteForCandidate(asciiToHex(name), {
        gas: 100000,
        gasPrice: 3000000000,
      });
      console.log('tx', tx);
      await this.waitForBlock(tx);
    } catch (err) {
      if (!err.message.match(/User denied transaction signature/)) {
        throw err;
      }
    }
    return await this.fetchCandidateVotes();
  }

  async fetchCandidateVotes() {
    const votes = await Promise.map(this.candidateList, name => {
      return this.methods.totalVotesFor(asciiToHex(name));
    });
    // .toString() is needed to convert from BigNumbers in web3 0.20.x
    return _.zipObject(this.candidateList, votes.map(v => v.toString()));
  }
}
