const hexToBinary = require("hex-to-binary"); //importing hex-to-binary-library
const { GENESIS_DATA, MINE_RATE } = require("../config"); //first block hardcoded data
const cryptoHash = require("../util/crypto-hash"); //hashing function

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
    const lastHash = lastBlock.hash;
    let hash, timestamp;
    let { difficulty } = lastBlock;
    let nonce = 0;

    //repeatedly running the hashing algorithm
    //until the dificulty params are met, upon completion producing
    //timestamp
    //also adjusting the difficulty level dependent on the amount of time taken
    //for the new block in comparison to the last block using the `adjustDiffuculty()`
    //static method to maintain block contruction within our MINE_RATE
    do {
      nonce++;
      timestamp = Date.now();
      difficulty = Block.adjustDifficulty({
        originalBlock: lastBlock,
        timestamp,
      });
      hash = cryptoHash(timestamp, lastHash, data, nonce, difficulty);
    } while (
      //using 256 bit binary to fine tune the difficulty as opposed to 64 bit hex
      //will still be displayed as 64 bit though in our data
      hexToBinary(hash).substring(0, difficulty) !== "0".repeat(difficulty)
    );

    return new Block({
      timestamp,
      lastHash,
      data,
      difficulty,
      hash,
      nonce,
    });
  }

  static adjustDifficulty({ originalBlock, timestamp }) {
    //desruct difficulty
    let { difficulty } = originalBlock;
    //makes sure difficulty is never going to be negative number
    //will terminate if so
    if (difficulty < 1) return (difficulty = 1);
    //if difference is greater then mine rate we want to lower difficulty
    if (timestamp - originalBlock.timestamp > MINE_RATE) return difficulty - 1;
    //increase difficulty unless we have exceeded mine rate
    //and execute if block
    return difficulty + 1;
  }
}

//node.js sharing code syntax
module.exports = Block;
