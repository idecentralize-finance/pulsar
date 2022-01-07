# PULSAR

Pulsar is a contract that will let you execute custom call on the blockchain and let you make use of the Flasloans in your trading sequences. You do not need to deploy a contract and since we use Polygon the gas to execute such operation is very cheap. 

You can use pulsar for you trading bot as well.

## install

clone this repo and run 

```npm install```.

or directly with npm install

```npm i @idecentralize/pulsar```

Once installed edit and **rename your env.example file to .env**. Make sure to never share this file.


We have created a demo1 call so you can validate the call.
The call require you to have 1 DAI and 1.5 MATIC

You will make a 1000 DAI loan and repay it back. It will cost you 0,90 DAI in loan fees charge by AAVE an 1 MATIC sent as msg.value that you pay only of you make a successful trade.


Once you have fund your wallet you can run the demo1. You can also make customs calls of your own.


Please open an issue if you run into one!

