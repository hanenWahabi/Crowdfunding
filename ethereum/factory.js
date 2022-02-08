import web3 from "./web3";
import CampaignFactory from "./build/CampaignFactory.json";
const ADDRESS = "0x3F5821dc0D478472F1D35cC6C57cd3EfC86EBEA7";

const instance = new web3.eth.Contract(CampaignFactory.abi, ADDRESS);

export default instance;
