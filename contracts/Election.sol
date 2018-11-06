pragma solidity ^0.4.11;

contract Election {
    
    //read candidate
    string public candidate;
    //constructor
    function Election () public{
       
        candidate = "Trump";
        
    }
}