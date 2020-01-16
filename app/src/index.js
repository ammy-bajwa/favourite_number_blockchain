import Web3 from "web3";
import numiArtifact from "../../build/contracts/Numi.json";

const App = {
  web3: null,
  account: null,
  numi: null,

  start: async function() {
    const { web3 } = this;

    try {
      // get contract instance
      const networkId = await web3.eth.net.getId();
      const deployedNetwork_numi = numiArtifact.networks[networkId];

      this.numi = new web3.eth.Contract(
        numiArtifact.abi,
        deployedNetwork_numi.address
      );

      // get accounts
      const accounts = await web3.eth.getAccounts();
      this.account = accounts[0];
    } catch (error) {
      console.error("Could not connect to contract or chain.");
    }
  },
  setStatus: function(message) {
    const status = document.getElementById("status");
    status.innerHTML = message;
  },
  handleForm: async function(event) {
    event.preventDefault();
    const {
      numi: {
        methods: { setUser }
      },
      account
    } = this;
    const elements = event.target.children;
    const address = elements[0].value;
    const num = elements[1].value;
    try {
      await setUser(address, num).send({
        from: account
      });
    } catch (err) {
      this.setStatus(err.message);
      console.log(err);
    }
  },
  getValue: async function(event) {
    event.preventDefault();
    const {
      methods: { users }
    } = this.numi;
    const elements = event.target.children;
    const address = elements[0].value;
    try {
      const value = await users(address).call();
      console.log(value);
      document.getElementById("valueTag").innerHTML = value;
    } catch (err) {
      this.setStatus(err.message);
      console.log(err);
    }
  }
};

window.App = App;

window.addEventListener("load", function() {
  if (window.ethereum) {
    // use MetaMask's provider
    App.web3 = new Web3(window.ethereum);
    window.ethereum.enable(); // get permission to access accounts
  } else {
    console.warn(
      "No web3 detected. Falling back to http://127.0.0.1:7545. You should remove this fallback when you deploy live"
    );
    // fallback - use your fallback strategy (local node / hosted node + in-dapp id mgmt / fail)
    App.web3 = new Web3(
      new Web3.providers.HttpProvider("http://127.0.0.1:7545")
    );
  }

  App.start();
});
