const HDWalletProvider = require("@truffle/hdwallet-provider");
const Web3 = require("web3");
const compiledFactory = require("./build/CampaignFactory.json"); //deploy CampainFactory only !!!

const provider = new HDWalletProvider(
  "lunar endorse valve hole faith flash auto hurdle travel music soldier cabin",
  "https://rinkeby.infura.io/v3/6329c2631d2e4dffb344c0dfefcf120d"
);

const web3 = new Web3(provider);
const deploy = async () => {
  const accounts = await web3.eth.getAccounts();
  const result = await new web3.eth.Contract(compiledFactory.abi)
    .deploy({ data: compiledFactory.evm.bytecode.object })
    .send({ from: accounts[0], gas: "2000000" });

  console.log("contract deployed to this address", result.options.address);
  provider.engine.stop();
};

deploy();
