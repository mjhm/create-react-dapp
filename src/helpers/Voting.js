import Promise from 'bluebird';
import Web3 from 'web3';
import _ from 'lodash';

const { asciiToHex, hexToAscii } = Web3.utils;

export default class Voting {
  constructor(account, contract) {
    this.contract = contract;
    this.account = account;
  }

  async initCandidateList() {
    const candidates = await this.contract.methods.getCandidateList().call();
    return (this.candidateList = candidates.map(hexToAscii));
  }

  async voteForCandidate(name) {
    await this.contract.methods
      .voteForCandidate(asciiToHex(name))
      .send({ from: this.account, gas: 100000 });
    return this.fetchCandidateVotes();
  }

  async fetchCandidateVotes() {
    const votes = await Promise.map(this.candidateList, name => {
      return this.contract.methods.totalVotesFor(asciiToHex(name)).call();
    });
    return _.zipObject(this.candidateList, votes);
  }
}
