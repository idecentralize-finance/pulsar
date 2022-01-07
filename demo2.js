require("dotenv").config();
require("@nomiclabs/hardhat-etherscan");
require("@nomiclabs/hardhat-waffle");
require("hardhat-gas-reporter");
require("solidity-coverage");


// ABI Of the call we want to make
const FLASH_LOAN_ABI = require('./abis/flashLoan.json');
const TRANSFER_FROM_ABI = require('./abis/transferFrom.json');
const ONE_INCH_SWAP = require('./abis/oneInchSwap.json');

// POLYGON ADDRESS
const PULSAR = "0xaF54b4C42E26b6BD8f676911b98C6C4a07Ac5d00";
const DAI = "0x8f3Cf7ad23Cd3CaDbD9735AFf958023239c6A063";
const USDC = "0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174";
const BNB = "0x3BA4c387f786bFEE076A58914F5Bd38d668B42c3";
const WETH = "0x7ceB23fD6bC0adD59E62ac25578270cFf1b9f619";

// This is a sample Hardhat task. To learn how to create your own go to
// https://hardhat.org/guides/create-task.html

task(
  "run-demo1", 
  "Execute the demo1 sequence", 
  async (_, {network, ethers, upgrades }) => {
    let override = { gasLimit: 4000000 };

    const signer = ethers.provider.getSigner(
            process.env.ADDRESS
        );

      let oneDai = '1000000000000000000'
      let dai = await ethers.getContractAt("IERC20", DAI, signer);
      let balance = await dai.balanceOf(process.env.ADDRESS);
      console.log("Initial DAI Balance : ",ethers.utils.formatUnits(balance,18))
     

        let borrowedAssets = [DAI]                            // <-- must match withdrawn
        let borrowedAmounts = ['1000000000000000000000']      
        let borrowedModes = [0]                              

        let loanSequence = [
            borrowedAssets,
            borrowedAmounts,
            borrowedModes
        ]

         let iface = new ethers.utils.Interface(JSON.stringify(TRANSFER_FROM_ABI));
         let sig = "swap(address, (address,address,address,address,uint256,uint256,uint256,bytes), bytes)";
         let data1 = iface.encodeFunctionData(sig,[process.env.ADDRESS,PULSAR,oneDai])


        // transfer the loan to your wallet
        //  iface = new ethers.utils.Interface(JSON.stringify(TRANSFER_ABI));
        //  sig = "transfer(address, uint256)";
        //  let data2 = iface.encodeFunctionData(sig,[process.env.LOCAL_ADDRESS,trade1Amount])
         

        // Target can't be Pulsar
        let targets = [DAI]
        let calls = [data1]

        let withdraw = [DAI] //< --- must match the length of borrowed asset at least.
        
        let tradeSequence = ethers.utils.defaultAbiCoder.encode([ "address[]", "bytes[]", "address[]" ], [ targets, calls, withdraw ])
         
         // Full sequence
         iface = new ethers.utils.Interface(JSON.stringify(FLASH_LOAN_ABI));
         sig = "flashLoanCall((address[],uint256[],uint[]),bytes)";
         let data = iface.encodeFunctionData(sig,[loanSequence,tradeSequence])

        const call = await signer.sendTransaction({
            to: PULSAR,
            data: data,        // change data here
            value: ethers.utils.parseUnits("1.0", "ether")
        });
         call.wait(1)


        console.log("Trade Executed")
         
      await dai.approve(PULSAR, '0', override);
      console.log("Approval reset.")   

});

//swap(address, (address,address,address,address,uint256,uint256,uint256,bytes), bytes)