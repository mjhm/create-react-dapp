/* eslint-env browser, jest */
import React from 'react';
import ReactDOM from 'react-dom';
import Promise from 'bluebird';
import App from './app';

const candidateVotes = {
  Rami: 4,
  Nick: 3,
  Jose: 2,
};

class MockEthInterface {
  candidateList = Object.keys(candidateVotes).sort();
  voteForCandidate(name) {
    candidateVotes[name] += 1;
    return Promise.resolve(candidateVotes);
  }

  fetchCandidateVotes() {
    return Promise.resolve(candidateVotes);
  }
}

it('renders without crashing', async () => {
  const div = document.createElement('div');

  ReactDOM.render(<App eth={new MockEthInterface()} />, div);
  return Promise.delay(10);
});
