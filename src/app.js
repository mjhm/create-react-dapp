import React from 'react';
import _ from 'lodash';
import { Container, Table, Button } from 'reactstrap';

import {
  candidateList,
  fetchCandidateVotes,
  voteForCandidate,
} from './helpers/eth_interface';

const CandidateRow = ({ name, votes, onClick }) => (
  <tr>
    <td>
      <Button color="primary" onClick={onClick}>
        {name}
      </Button>
    </td>
    <td>{votes}</td>
  </tr>
);

class App extends React.Component {
  constructor(props) {
    super(props);
    const votes = _.zipObject(candidateList, candidateList.map(() => 0));
    this.state = { votes };
  }

  async componentDidMount() {
    const votes = await fetchCandidateVotes();
    this.setState({ votes });
  }

  async handleVote(name) {
    const votes = await voteForCandidate(name);
    this.setState({ votes });
  }

  render() {
    return (
      <Container>
        <h1>Simple React Voting Application</h1>
        <Table bordered>
          <thead>
            <tr>
              <th>Vote For:</th>
              <th>Votes</th>
            </tr>
          </thead>
          <tbody>
            {candidateList.map(name => (
              <CandidateRow
                key={name}
                name={name}
                votes={this.state.votes[name]}
                onClick={this.handleVote.bind(this, name)}
              />
            ))}
          </tbody>
        </Table>
      </Container>
    );
  }
}

export default App;
