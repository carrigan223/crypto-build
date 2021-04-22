const { GENESIS_DATA } = require("./config");//first block hardcoded data
const cryptoHash = require("./crypto-hash");//hashing function

//creating class instance of a block
//contructor arguments as object to give us the ability to accesswith key
class Block {
  constructor({ timestamp, lastHash, hash, data }) {
    this.timestamp = timestamp;
    this.lastHash = lastHash;
    this.hash = hash;
    this.data = data;
  }
  //factory method creating our genesis(fisrt) block
  static genesis() {
    return new Block(GENESIS_DATA);
  }

  static mineBlock({ lastBlock, data }) {
    const timestamp = Date.now();
    const lastHash = lastBlock.hash;

    return new Block({
      timestamp,
      lastHash,
      data,
      hash: cryptoHash(timestamp, lastHash, data),
    });
  }
}

//node.js sharing code syntax
module.exports = Block;
