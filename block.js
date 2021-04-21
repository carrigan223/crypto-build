const { GENESIS_DATA } = require("./config");

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
      return new Block({
          timestamp: Date.now(),
          lastHash: lastBlock.hash,
          data
      });
  }
}

//node.js sharing code syntax
module.exports = Block;
