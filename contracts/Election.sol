pragma solidity ^0.4.2;

contract Election {
    // Model a Candidate
    struct Candidate {
        uint id;
        string name;
        uint voteCount;
    }
    // Store accounts that have voted
    mapping(address => bool) public voters;
    // Read/write candidates
    mapping(uint => Candidate) public candidates;

    // Store Candidates Count
    uint public candidatesCount;

    function Election () public {
        addCandidate("Trump");
        addCandidate("Kim");
    }

    function addCandidate (string _name) private {
        candidatesCount ++;
        candidates[candidatesCount] = Candidate(candidatesCount, _name, 0);
    }

    function vote(uint _candidateId) public {
        // require that the haven't voted before
        require(!voters[msg.sender]);

        //require a valid candidate
        require((_candidateId > 0 && _candidateId <= candidatesCount));

        // record that voter has voted
        //vv accessing the account who is sending this function
        voters[msg.sender] = true; //solidity allows us to pass in more arguments defined

        //update candidate vote Count
        candidates[_candidateId].voteCount ++;

    }

}