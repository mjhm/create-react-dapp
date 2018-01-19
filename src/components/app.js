// @flow

import React from 'react';
import { Container } from 'reactstrap';
import VotingTable from './VotingTable';
import fetchContracts from '../helpers/fetchContracts';
import Voting from '../helpers/Voting';

class App extends React.Component {
  state: {
    votes: any,
    poll: any,
  };

  constructor(props: { network: string, from: string }) {
    super(props);
    this.state = {
      votes: null,
      poll: null,
    };
  }

  async componentDidMount(): any {
    const { from, contracts } = await fetchContracts(this.props.network, [
      'Voting',
    ]);
    const poll = new Voting(this.props.from || from, contracts.Voting);
    await poll.initCandidateList();
    const votes = await poll.fetchCandidateVotes();
    this.setState({
      votes,
      poll,
    });
  }

  voteHandler = (name: string) => async () => {
    const votes = await this.state.poll.voteForCandidate(name);
    this.setState({ votes });
  };

  render() {
    return (
      <Container>
        <h1>Simple React Voting Application</h1>
        {this.state.votes ? (
          <VotingTable
            candidateList={this.state.poll.candidateList}
            votes={this.state.votes}
            voteHandler={this.voteHandler}
          />
        ) : null}
      </Container>
    );
  }
}

export default App;
