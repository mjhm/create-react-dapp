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

const convertMethodToNewWeb3Pattern = method => {
  // Converter to allow web3 0.20.x methods to be called like 1.x methods.
  // this isn't a general purpose converter, but works for our methods.
  return (...args) => {
    return {
      call: options => Promise.promisify(method)(...args, options),
      send: options => Promise.promisify(method)(...args, options),
    };
  };
};

export default class Voting {
  constructor(contract) {
    this.contract = contract;
    this.methods =
      // web3 1.x
      this.contract.methods ||
      // web3 0.20.x
      _.mapValues(
        {
          getCandidateList: this.contract.getCandidateList,
          voteForCandidate: this.contract.voteForCandidate,
          totalVotesFor: this.contract.totalVotesFor,
        },
        convertMethodToNewWeb3Pattern,
      );
  }

  async initCandidateList() {
    return new Promise((resolve, reject) => {
      this.contract.getCandidateList.call((err, list) => {
        console.log('err', err);
        console.log('list', list);
        resolve((this.candidateList = list.map(hexToAscii)));
      });
    });
    // const candidates = await this.methods.getCandidateList().call();
    // const candidates = await this.methods.getCandidateList().call();
    // console.log('candidates', candidates);
    // return (this.candidateList = candidates.map(hexToAscii));
  }

  async voteForCandidate(name) {
    await this.methods.voteForCandidate(asciiToHex(name)).send({ gas: 100000 });
    return this.fetchCandidateVotes();
  }

  async fetchCandidateVotes() {
    const votes = await Promise.map(this.candidateList, name => {
      return this.methods.totalVotesFor(asciiToHex(name)).call();
    });
    // .toString() is needed to convert from BigNumbers in web3 0.20.x
    return _.zipObject(this.candidateList, votes.map(v => v.toString()));
  }
}
