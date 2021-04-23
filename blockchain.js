//creating the class instance of blockchain
//importing Block class from block.js
const Block = require("./block");
const cryptoHash = require("./crypto-hash");
//starting the chain with the genesis block
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

  static isValidChain(chain) {
    //checking that the data at genesis block matches a new instance of genesis data
    if (JSON.stringify(chain[0]) !== JSON.stringify(Block.genesis())) {
      return false;
    }
    //checking all the blocks not including genesis
    for (let i = 1; i < chain.length; i++) {
      const block = chain[i]; //current block
      const actualLastHash = chain[i - 1].hash;
      const { timestamp, hash, lastHash, data } = block; // destructuring block to access values
      //comparing lastHash to what it should be
      if (actualLastHash !== lastHash) {
        return false;
      }
      //creating the hash to validate against
      const validHash = cryptoHash(timestamp, lastHash, data);
      //making sure our hash is correct
      if (hash !== validHash) {
        return false;
      }
    }
    return true;
  }
}

module.exports = Blockchain;
