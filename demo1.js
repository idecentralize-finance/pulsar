require("dotenv").config();

// ABI Of the call we want to make
const FLASH_LOAN_ABI = require('./abis/flashLoan.json');
const TRANSFER_FROM_ABI = require('./abis/transferFrom.json');


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
    let override = { gasLimit: 3000000 };

    const signer = ethers.provider.getSigner(
            process.env.ADDRESS
        );
      /* You will need 1 MATIC + Gas fees and 1 DAI to run this example
      You need to pay the 0.09% fees for the loan to work
      As an example we approve the contract to pull the missing day in order to work.

      This is why we use a very small amount.
      You should never approve this contract to pull funds from your wallet.
      This is only to make it work without a complex strategy.


      depending on the amount you borrow. most of the DAI will come back to you
      The lender (AAVE) ask for 0.09% fees on the loan(premiums).
      **/

      // DAI
      let oneDai = '1000000000000000000'
      let dai = await ethers.getContractAt("IERC20", DAI, signer);
      let balance = await dai.balanceOf(process.env.ADDRESS);
      console.log("Initial DAI Balance : ",ethers.utils.formatUnits(balance,18))
     
      // we set the allowance for pulsar to pull the funds when he runs the sequence.
      // make sure to consume the allowance or reset it when you done.
      // otherwise i can send a call to the contract  and withdraw the allowance you did not rest
      // only approve what you need and always reset the allowance.
       await dai.approve(PULSAR, oneDai, override);   

       // define your trade sequence call
       // they are arrays because you can borrow multiple assets
       // See Aave Doc mor mode. or leave it to 0

       // it will cost us 0,90 DAI to borrow 1000 DAI
       // you can borrow multiple asset
       // borrowedAssets = [DAI,USDC,WETH,MATIC] 4 entry that must be withdrawn as well
       // borrowedAssets = [DAIAMOUNT,USDCAMOUNT,WETHAMOUNT,MATICAMOUNT] 4 matching
        let borrowedAssets = [DAI]                            // <-- must match withdrawn
        let borrowedAmounts = ['1000000000000000000000']      // <-- Flashloan amount
        let borrowedModes = [0]                               // <-- see aave documentation

        let loanSequence = [
            borrowedAssets,
            borrowedAmounts,
            borrowedModes
        ]

        // we are able to pull funds from our wallet into the contract only if we approved it.
        // Do not send funds directly to the contract.
        // we approved 1 DAI to be pulled. It would cost someone 1 Matic to steal you DAI
        // But you would not approve anything in an attempt at profit. It the calls fails you only pay the gas

         let iface = new ethers.utils.Interface(JSON.stringify(TRANSFER_FROM_ABI));
         let sig = "transferFrom(address, address, uint256)";
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

        const tx = await signer.sendTransaction({
            to: PULSAR,
            data: data,        // change data here
            value: ethers.utils.parseUnits("1.0", "ether")
        });
        // tx.wait(1)


        console.log("Trade Executed")
         
      await dai.approve(PULSAR, '0', override);
      console.log("Approval reset.")   

});