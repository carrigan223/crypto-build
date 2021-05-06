//creating the class instance of blockchain
//importing Block class from block.js
const Block = require("./block");
const { cryptoHash } = require("../util/index");

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

  replaceChain(chain) {
    if (chain.length <= this.chain.length) {
      //add error message
      console.error("incoming chain must be longer then current");
      return;
    }
    if (!Blockchain.isValidChain(chain)) {
      //add error message
      console.error("incoming chain is not validated against the the current");
      return;
    }

    console.log("Replacing current chain with ", chain);
    this.chain = chain;
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
