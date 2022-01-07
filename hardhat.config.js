require("dotenv").config();

const { task } = require("hardhat/config");

require("hardhat/config");
require("dotenv").config();
require("@nomiclabs/hardhat-ethers");


const FLASH_LOAN_ABI = require('./abis/flashLoan.json');
const APPROVE_ABI = require('./abis/approve.json');
const TRANSFER_ABI = require('./abis/transfer.json');
const TRANSFER_FROM_ABI = require('./abis/transferFrom.json');


// POLYGON ADDRESS
const PULSAR = "0xaF54b4C42E26b6BD8f676911b98C6C4a07Ac5d00";
const DAI = "0x8f3Cf7ad23Cd3CaDbD9735AFf958023239c6A063";
const USDC = "0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174";
const BNB = "0x3BA4c387f786bFEE076A58914F5Bd38d668B42c3";
const WETH = "0x7ceB23fD6bC0adD59E62ac25578270cFf1b9f619";

// DEMO task
require("./demo1.js");

// to execute a task, in a terminal
// npx hardhat run-demo1

// for support for more complex strategies join out discord
// https://discord.gg/y58xv2Gn

// This is a sample Hardhat task. To learn how to create your own go to
// https://hardhat.org/guides/create-task.html

// You need to export an object to set up your config
// Go to https://hardhat.org/config/ to learn more

/**
 * @type import('hardhat/config').HardhatUserConfig
 */


module.exports = {
  defaultNetwork: "polygon",
  networks: {
    polygon: {
     
        url: "https://polygon-rpc.com/",
        chainId: 137,
        gasPrice: 600000000000,
        gas:2000000,
        gasLimit:3000000,
        accounts: {mnemonic: process.env.MNEMONIC}
    
    },
  },
  paths: {
    sources: "./contracts",
    tests: "./test",
    artifacts: "./artifacts",
  
},


};
