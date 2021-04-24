const { GENESIS_DATA } = require("./config"); //first block hardcoded data
const cryptoHash = require("./crypto-hash"); //hashing function

//creating class instance of a block
//contructor arguments as object to give us the ability to accesswith key
class Block {
  constructor({ timestamp, lastHash, hash, data, nonce, difficulty }) {
    this.timestamp = timestamp;
    this.lastHash = lastHash;
    this.hash = hash;
    this.data = data;
    this.nonce = nonce;
    this.difficulty = difficulty;
  }
  //factory method creating our genesis(fisrt) block
  static genesis() {
    return new Block(GENESIS_DATA);
  }
  /* 
  mineblock is generating a new block based off all the current blocks data,
  then using that data along with the hash of the previous block and a nonce value 
  that that produces a hash equivilant to the dynamic difficulty params as the proof of work 
  method.
  */
  static mineBlock({ lastBlock, data }) {
    let hash, timestamp;
    const lastHash = lastBlock.hash;
    const { difficulty } = lastBlock;
    let nonce = 0;

    //repeatedly running the hashing algorithm
    //until the dificulty params are met, upon completion producing
    //timestamp
    do {
      nonce++;
      timestamp = Date.now();
      hash = cryptoHash(timestamp, lastHash, data, nonce, difficulty);
    } while (hash.substring(0, difficulty) !== "0".repeat(difficulty));

    return new Block({
      timestamp,
      lastHash,
      data,
      difficulty,
      hash,
      nonce,
    });
  }
}

//node.js sharing code syntax
module.exports = Block;
