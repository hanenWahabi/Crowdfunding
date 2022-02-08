import Web3 from "web3";

let web3;
if (typeof window !== "undefined" && window.web3 !== "undefined") {
  window.ethereum.request({ method: "eth_requestAccounts" });
  web3 = new Web3(window.ethereum);
} else {
  const provider = new Web3.providers.HttpProvider(
    "https://rinkeby.infura.io/v3/6329c2631d2e4dffb344c0dfefcf120d"
  );
  web3 = new Web3(provider);
}
export default web3;
