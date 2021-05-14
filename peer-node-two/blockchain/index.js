//creating the class instance of blockchain
//importing Block class from block.js
const Wallet = require("../wallet/index");
const Block = require("./block");
const Transaction = require("../wallet/transaction");
const { cryptoHash } = require("../util/index");
const { REWARD_INPUT, MINING_REWARD } = require("../config");

/* 
  Class instance of the blockchain containg the true chain at this.chain,
  this class contains the `addBlock()` method for appending a block to the end of the 
  block chain along with a `replaceChain()` method for replacing the chain assuming
  the chan has passed the `isValidChain()` method
*/

class Blockchain {
  constructor() {
    this.chain = [Block.genesis()];
  }
  //generic add block method taking in the last block of the chain
  //and the data applying to the mineBlock method of the Block class
  addBlock({ data }) {
    const newBlock = Block.mineBlock({
      lastBlock: this.chain[this.chain.length - 1],
      data,
    });
    //pushing the new block to the end of the chain
    this.chain.push(newBlock);
  }
  //method to replace the `chain`, this method first runs through multiple validation
  //checks befor finally replacing the `chain`
  replaceChain(chain, validateTransactions, onSuccess) {
    if (chain.length <= this.chain.length) {
      console.error("incoming chain must be longer then current");
      return;
    }
    if (!Blockchain.isValidChain(chain)) {
      console.error("incoming chain is not validated against the the current");
      return;
    }
    if (validateTransactions && !this.validTransactionData({ chain })) {
      console.error("The incoming Chain has invalid transaction data");
      return;
    }

    if (onSuccess) onSuccess();
    console.log("Replacing current chain with ", chain);
    this.chain = chain;
  }

  //`validtransactionData` is checking the local chain strating
  //at first block after thegenesis block. we are then checking that only
  //one reward transacation exist forthere should only be one reward per block.
  //we are then verifying that if we find a reward the reward amount is the valid amount
  //set in `MINING_REWARD`. we are then checking if the transaction is valid followed by
  //whether the the wallet balance is true or malformed. finnally we are making sure there are no
  //identical transactions.
  validTransactionData({ chain }) {
    for (let i = 1; i < chain.length; i++) {
      const block = chain[i];
      const transactionSet = new Set();
      let rewardTransactionCount = 0;

      for (let transaction of block.data) {
        if (transaction.input.address == REWARD_INPUT.address) {
          rewardTransactionCount += 1;

          if (rewardTransactionCount > 1) {
            console.error("Miner Reward Exceeds Limit");
            return false;
          }

          if (Object.values(transaction.outputMap)[0] !== MINING_REWARD) {
            console.error("Miner reward amount is invalid");
            return false;
          }
        } else {
          if (!Transaction.validTransaction(transaction)) {
            console.error("Invalid Transaction");
            return false;
          }

          const trueBalance = Wallet.calculateBalance({
            chain: this.chain,
            address: transaction.input.address,
          });

          if (transaction.input.amount !== trueBalance) {
            console.error("Invalid Input Amount");
            return false;
          }

          if (transactionSet.has(transaction)) {
            console.error(
              "An identical transaction appears multiple times in the block"
            );
            return false;
          } else {
            transactionSet.add(transaction);
          }
        }
      }
    }

    return true;
  }

  static isValidChain(chain) {
    //checking that the data at genesis block matches a new instance of genesis data
    if (JSON.stringify(chain[0]) !== JSON.stringify(Block.genesis())) {
      return false;
    }
    //checking all the blocks not including genesis
    for (let i = 1; i < chain.length; i++) {
      const block = chain[i]; //current block
      const actualLastHash = chain[i - 1].hash;
      const lastDifficulty = chain[i - 1].difficulty;
      const { timestamp, hash, lastHash, data, nonce, difficulty } = block; // destructuring block to access values
      //comparing lastHash to what it should be
      if (actualLastHash !== lastHash) {
        return false;
      }
      //creating the hash to validate against
      const validHash = cryptoHash(
        timestamp,
        lastHash,
        data,
        nonce,
        difficulty
      );
      //making sure our hash is correct
      if (hash !== validHash) {
        return false;
      }
      //verifying the difficulty behavior is correct
      //comparing the last difficulty and current difficulty
      //if difference is greater then one there has been tampering
      //using `Math.abs` to give an absolute value to protect against raising
      //also
      if (Math.abs(lastDifficulty - difficulty) > 1) {
        return false;
      }
    }
    return true;
  }
}

module.exports = Blockchain;
