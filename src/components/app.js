/* global web3 */
// @flow

import React from 'react';
import { Container } from 'reactstrap';
import VotingTable from './VotingTable';
import getWeb3 from '../helpers/getWeb3';
import fetchContracts from '../helpers/fetchContracts';
import Voting from '../helpers/Voting';

declare var web3;

type EthInterface = {
  candidateList: Array<string>,
  voteForCandidate: (name: string) => Promise<any>,
  fetchCandidateVotes: () => Promise<any>,
};

class App extends React.Component {
  state: {
    web3: any,
    votes: any,
    race: any,
  };
  eth: EthInterface;

  constructor(props: EthInterface) {
    super(props);
    this.state = {
      web3: null,
      votes: null,
      race: null,
    };
  }

  async componentDidMount(): any {
    const newWeb3 = await getWeb3();
    this.setState({ web3: newWeb3 });
    const contracts = await fetchContracts(newWeb3, ['Voting']);
    const race = new Voting(newWeb3, contracts.Voting);
    const votes = await race.fetchCandidateVotes();
    this.setState({
      web3: newWeb3,
      votes,
      race,
    });
  }

  voteHandler = (name: string) => async () => {
    const votes = await this.state.race.voteForCandidate(name);
    this.setState({ votes });
  };

  render() {
    return (
      <Container>
        <h1>Simple React Voting Application</h1>
        {this.state.votes ? (
          <VotingTable
            candidateList={this.state.race.candidateList}
            votes={this.state.votes}
            voteHandler={this.voteHandler}
          />
        ) : null}
      </Container>
    );
  }
}

export default App;
