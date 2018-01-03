// @flow

import React from 'react';
import { Container } from 'reactstrap';
import VotingTable from './voting_table';

type EthInterface = {
  candidateList: Array<string>,
  voteForCandidate: (name: string) => Promise<any>,
  fetchCandidateVotes: () => Promise<any>,
};

class App extends React.Component {
  state: { votes: any };
  eth: EthInterface;

  constructor(props: EthInterface) {
    super(props);
    this.state = { votes: null };
  }

  async componentDidMount(): any {
    const votes = await this.props.eth.fetchCandidateVotes();
    this.setState({ votes });
  }

  voteHandler = (name: string) => async () => {
    const votes = await this.props.eth.voteForCandidate(name);
    this.setState({ votes });
  };

  render() {
    return (
      <Container>
        <h1>Simple React Voting Application</h1>
        {this.state.votes ? (
          <VotingTable
            candidateList={this.props.eth.candidateList}
            votes={this.state.votes}
            voteHandler={this.voteHandler}
          />
        ) : null}
      </Container>
    );
  }
}

export default App;
