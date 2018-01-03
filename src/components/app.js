import React from 'react';
import { Container } from 'reactstrap';
import VotingTable from './voting_table';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = { votes: null };
    this.eth = props.eth;
  }

  async componentDidMount() {
    const votes = await this.eth.fetchCandidateVotes();
    this.setState({ votes });
  }

  voteHandler = name => async () => {
    const votes = await this.eth.voteForCandidate(name);
    this.setState({ votes });
  };

  render() {
    return (
      <Container>
        <h1>Simple React Voting Application</h1>
        {this.state.votes ? (
          <VotingTable
            candidateList={this.eth.candidateList}
            votes={this.state.votes}
            voteHandler={this.voteHandler}
          />
        ) : null}
      </Container>
    );
  }
}

export default App;
