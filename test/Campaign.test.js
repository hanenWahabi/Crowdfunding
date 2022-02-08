const assert = require("assert");
const ganache = require("ganache-cli");
const Web3 = require("web3");
const web3 = new Web3(ganache.provider());

const compiledFactory = require("../ethereum/build/CampaignFactory.json");
const compiledCampaign = require("../ethereum/build/Campaign.json");
const { it } = require("mocha");

let accounts;
let factory;
let campaignAddress;
let campaign;

beforeEach(async () => {
  accounts = await web3.eth.getAccounts();
  factory = await new web3.eth.Contract(compiledFactory.abi)
    .deploy({ data: compiledFactory.evm.bytecode.object })
    .send({ from: accounts[0], gas: "3000000" });

  await factory.methods
    .createCampaign("100") //wei
    .send({ from: accounts[0], gas: "1000000" });

  [campaignAddress] = await factory.methods.getAllDeployedCampaigns().call();

  campaign = await new web3.eth.Contract(compiledCampaign.abi, campaignAddress); //Contract(abi, address)
});

describe("Campaigns", () => {
  it("deploys a factory and a campaign", () => {
    assert.ok(factory.options.address);
    assert.ok(campaign.options.address);
  });

  it("marks caller as the campaign manager", async () => {
    const manager = await campaign.methods.manager().call();
    assert.equal(accounts[0], manager);
  });

  it("allows people to contribute money and mark them as contributers", async () => {
    await campaign.methods
      .contribute()
      .send({ from: accounts[1], value: "200" });
    const isContributer = await campaign.methods
      .contributors(accounts[1])
      .call();
    assert(isContributer);
  });

  it("requires a minimum contibution", async () => {
    try {
      await campaign.methods
        .contribute()
        .send({ value: "5", from: accounts[1] });
      assert(false);
    } catch (error) {
      assert(true);
    }
  });

  it("allows a manager to make a payment request", async () => {
    await campaign.methods
      .createRequest("Buy batteries", "100", accounts[1])
      .send({ from: accounts[0], gas: "1000000" });
    const request = await campaign.methods.requests(0).call();
    assert.equal("Buy batteries", request.description);
  });

  it("processes requests", async () => {
    await campaign.methods.contribute().send({
      from: accounts[0],
      value: web3.utils.toWei("10", "ether"),
    });

    let preBalance = await web3.eth.getBalance(accounts[1]);
    preBalance = web3.utils.fromWei(preBalance, "ether");
    preBalance = parseFloat(preBalance);

    await campaign.methods
      .createRequest("A", web3.utils.toWei("5", "ether"), accounts[1])
      .send({ from: accounts[0], gas: "1000000" });

    await campaign.methods
      .approveRequest(0)
      .send({ from: accounts[0], gas: "1000000" });

    await campaign.methods
      .finalizeRequest(0)
      .send({ from: accounts[0], gas: "1000000" });

    let postBalance = await web3.eth.getBalance(accounts[1]);
    postBalance = parseFloat(web3.utils.fromWei(postBalance, "ether"));
    assert(postBalance > preBalance);
  });
});
