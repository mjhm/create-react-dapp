/* global ABI_DEFINITION, CONTRACT_ADDRESS */

import Promise from 'bluebird';
import Web3 from 'web3';
import _ from 'lodash';

const web3 = new Web3(new Web3.providers.HttpProvider('http://localhost:8545'));
const asciiToHex = Web3.utils.asciiToHex;
const contractInstance = new web3.eth.Contract(
  ABI_DEFINITION,
  CONTRACT_ADDRESS,
);

export const candidateList = ['Rama', 'Nick', 'Jose'];

export const voteForCandidate = async name => {
  const accounts = await web3.eth.getAccounts();
  await contractInstance.methods
    .voteForCandidate(asciiToHex(name))
    .send({ from: accounts[0] });
  return fetchCandidateVotes(candidateList);
};

export const fetchCandidateVotes = async () => {
  const votes = await Promise.map(candidateList, name =>
    contractInstance.methods.totalVotesFor(asciiToHex(name)).call(),
  );
  return _.zipObject(candidateList, votes);
};
