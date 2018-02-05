pragma solidity ^0.4.11;

import "truffle/Assert.sol";
import "../contracts/Voting.sol";
import "../lib/github/Modular-Network/ethereum-libraries/StringUtilsLib/StringUtilsLib.sol";

contract TestVoting {
  using StringUtilsLib for *;

  function stringToBytes32(string memory source) public pure returns (bytes32 result) {
    bytes memory tempEmptyStringTest = bytes(source);
    if (tempEmptyStringTest.length == 0) {
        return 0x0;
    }

    assembly {
        result := mload(add(source, 32))
    }
  }
  
  bytes32 joeBytes;
  bytes32 bobBytes;
  bytes32[] testNames;
  Voting voting;

  function beforeAll() public {
    joeBytes = stringToBytes32("joe");
    bobBytes = stringToBytes32("bob");
    testNames.push(joeBytes);
    testNames.push(bobBytes);
  }

  function beforeEach() public {
    voting = new Voting(testNames);
  }

  function testConstructorSetsInitialNames() public {

    bytes32 nobody = voting.candidateList(1);
    uint len = voting.getCandidateListLength();

    Assert.equal(voting.candidateList(0).toSliceB32().toString(), "joe", "Initial candidate should be joe");
    Assert.equal(voting.candidateList(1).toSliceB32().toString(), "bob", "Initial candidate should be bob");
    Assert.equal(voting.getCandidateListLength(), 2, "List has length 2");
  }

  function testInitialVoteTotal() public {
    Assert.equal(voting.totalVotesFor(bobBytes), uint(0), "Initial votes for bob is 0");
  }

  function testValidCandidate() public {
    bytes32 lisaBytes = stringToBytes32("lisa");
    Assert.isTrue(voting.validCandidate(joeBytes), "joe is a valid candidate");
    Assert.isFalse(voting.validCandidate(lisaBytes), "lisa is an invalid candidate");
  }

  function testVoteForCandidate() public {
    voting.voteForCandidate(joeBytes);
    Assert.equal(voting.totalVotesFor(joeBytes), uint(1), "One vote for joe");
  }
}
