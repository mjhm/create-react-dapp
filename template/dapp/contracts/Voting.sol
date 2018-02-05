pragma solidity ^0.4.11;
// We have to specify what version of compiler this code will compile with

import "../lib/mortal.sol";

contract Voting is mortal {
  mapping (bytes32 => uint8) public votesReceived;

  bytes32[] public candidateList;

  function Voting(bytes32[] candidateNames) public {
    candidateList = candidateNames;
  }

  function getCandidateList() public view returns (bytes32[]) {
    return candidateList;
  }

  function getCandidateListLength() public view returns (uint) {
    return candidateList.length;
  }

  function totalVotesFor(bytes32 candidate) public view returns (uint8) {
    require(validCandidate(candidate));
    return votesReceived[candidate];
  }

  function voteForCandidate(bytes32 candidate) public {
    require(validCandidate(candidate));
    votesReceived[candidate] += 1;
  }

  function validCandidate(bytes32 candidate) public view returns (bool) {
    for(uint i = 0; i < candidateList.length; i++) {
      if (candidateList[i] == candidate) {
        return true;
      }
    }
    return false;
  }
}
