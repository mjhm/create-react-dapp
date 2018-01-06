// @flow

import React from 'react';
import { Table, Button } from 'reactstrap';

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

type votingTableProps = {
  candidateList: Array<string>,
  votes: { [name: string]: number },
  voteHandler: (name: string) => () => any,
};

const VotingTable = (props: votingTableProps) => (
  <Table bordered>
    <thead>
      <tr>
        <th>Vote For:</th>
        <th>Votes</th>
      </tr>
    </thead>
    <tbody>
      {props.candidateList.map(name => (
        <CandidateRow
          key={name}
          name={name}
          votes={props.votes[name]}
          onClick={props.voteHandler(name)}
        />
      ))}
    </tbody>
  </Table>
);

export default VotingTable;
