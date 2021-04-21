//creating class instance of a block
//contructor arguments as object to give us the ability to accesswith key
class Block {
  constructor({ timestamp, lastHash, hash, data }) {
    this.timestamp = timestamp;
    this.lastHash = lastHash;
    this.hashl = hash;
    this.data = data;
  }
}

//creating a test block using the Block class
//make sure the argument is a object refrencing the key when
//inputing value
const block1 = new Block({
  lastHash: "fooLastHash",
  data: "fooData",
  timestamp: "01/01/01",
  hash: "fooHash",
});

console.log("Block1: ", block1);
