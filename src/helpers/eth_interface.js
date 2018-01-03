/* global ABI_DEFINITION, CONTRACT_ADDRESS */

import Promise from 'bluebird';
import Web3 from 'web3';
import _ from 'lodash';

const asciiToHex = Web3.utils.asciiToHex;

export default class EthInterface {
  constructor() {
    this.web3 = new Web3(
      new Web3.providers.HttpProvider('http://localhost:8545'),
    );
    this.contractInstance = new this.web3.eth.Contract(
      ABI_DEFINITION,
      CONTRACT_ADDRESS,
    );
  }

  candidateList = ['Rama', 'Nick', 'Jose'];

  async voteForCandidate(name) {
    const accounts = await this.web3.eth.getAccounts();
    await this.contractInstance.methods
      .voteForCandidate(asciiToHex(name))
      .send({ from: accounts[0] });
    return this.fetchCandidateVotes();
  }

  async fetchCandidateVotes() {
    const votes = await Promise.map(this.candidateList, name =>
      this.contractInstance.methods.totalVotesFor(asciiToHex(name)).call(),
    );
    return _.zipObject(this.candidateList, votes);
  }
}
