require("@nomiclabs/hardhat-waffle");

module.exports = {
  solidity: "0.8.17", // Specify the Solidity compiler version
  networks: {
    // Local Hardhat network configuration
    localhost: {
      url: "http://127.0.0.1:8545", // Default Hardhat local blockchain URL
    },
  },
};