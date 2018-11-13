App = {
  web3Provider: null,
  contracts: {},
  account: '0x0',

  //initialize app
  init: function() {
    return App.initWeb3(); //initialize web3
  },

  //connects our client side application to our local block chain
  initWeb3: function() {
    // TODO: refactor conditional
    if (typeof web3 !== 'undefined') {
      // If a web3 instance is already provided by Meta Mask.If we login with metamask it will provide us with a web3 provider
      App.web3Provider = web3.currentProvider; //setting the web3 provider to our app web3 provider
      web3 = new Web3(web3.currentProvider);
    } else {
      // Specify default instance if no web3 instance provided
      App.web3Provider = new Web3.providers.HttpProvider('http://localhost:7545');
      web3 = new Web3(App.web3Provider);
    }
    return App.initContract(); //Once connected, we'll initialize our contract
  },

  //vvv This fuction loads our contract to our front end app so that we can interact with it
  initContract: function() {
    $.getJSON("Election.json", function(election) {         // load a json file to our election artifact
      // Instantiate a new truffle contract from the artifact
      App.contracts.Election = TruffleContract(election);   // this truffle contract is the actual contract we can interact with inside our app 
      // Connect provider to interact with contract
      App.contracts.Election.setProvider(App.web3Provider);

      return App.render(); //Now we can render our app
    });
  },

  //vvv This function will add all the layout contents into our page
  render: function() {
    var electionInstance;
    var loader = $("#loader");
    var content = $("#content");

    loader.show();
    content.hide();

    // Load account data
    web3.eth.getCoinbase(function(err, account) { //provide us the account currently connected to the blockchain
      if (err === null) {
        App.account = account;
        $("#accountAddress").html("Your Account: " + account);
      }
    });

    // Load contract data
    App.contracts.Election.deployed().then(function(instance) { //getting a copy of our deployed contract
      electionInstance = instance;
      return electionInstance.candidatesCount();
    }).then(function(candidatesCount) {
      var candidatesResults = $("#candidatesResults");
      candidatesResults.empty();

      for (var i = 1; i <= candidatesCount; i++) {
        electionInstance.candidates(i).then(function(candidate) {
          var id = candidate[0];
          var name = candidate[1];
          var voteCount = candidate[2];

          // Render candidate Result
          var candidateTemplate = "<tr><th>" + id + "</th><td>" + name + "</td><td>" + voteCount + "</td></tr>"
          candidatesResults.append(candidateTemplate);
        });
      }

      loader.hide();
      content.show();
    }).catch(function(error) {
      console.warn(error);
    });
  }
};

$(function() {
  $(window).load(function() {
    App.init();
  });
});
