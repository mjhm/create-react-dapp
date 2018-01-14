import Promise from 'bluebird';
import Web3 from 'web3';
import _ from 'lodash';

const asciiToHex = Web3.utils.asciiToHex;

export default class Voting {
  constructor(web3, contract) {
    this.contract = contract;
    this.web3 = web3;
    console.log('contract', contract);
    this.contract.events
      .allEvents({}, (error, event) => {
        console.log('EVENT init', event, error);
      })
      .on('data', event => {
        console.log('EVENT data', event);
      })
      .on('error', console.error);
  }

  candidateList = ['Rama', 'Nick', 'Jose'];

  async voteForCandidate(name) {
    const accounts = await this.web3.eth.getAccounts();
    console.log('voteForCandidate accounts', accounts);
    await this.contract.methods
      .voteForCandidate(asciiToHex(name))
      .send({ from: accounts[0], gas: 100000 });
    return this.fetchCandidateVotes();
  }

  async fetchCandidateVotes() {
    const votes = await Promise.map(this.candidateList, name => {
      return this.contract.methods.totalVotesFor(asciiToHex(name)).call();
    });
    console.log('votes', votes);
    return _.zipObject(this.candidateList, votes);
  }
}
