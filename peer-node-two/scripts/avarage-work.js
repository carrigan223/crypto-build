/*
    this is a script to examine the avg time it takes to mine a block, the hash
    is converted to binary form and difculty is adjusted accordingly to achieve
    a consistent mine rate in line with what we have set
*/

const Blockchain = require("../blockchain"); //importing block chain

const blockchain = new Blockchain(); //creating ne instance of blockchain

blockchain.addBlock({ data: "initial" }); //using `addBlock` method we are adding an initial block

let prevTimestamp, nextTimestamp, nextBlock, timeDiff, avg; //setting variables

const times = []; //this array will store the creation time data

//for loop for generating a 10000 block test case
for (let i = 0; i < 10000; i++) {
  //setting the previous timestamp to the timestamp of the last block on chain
  prevTimestamp = blockchain.chain[blockchain.chain.length - 1].timestamp;
  //adding a new block with data set to the counter instance of `i`
  blockchain.addBlock({ data: `block ${i}` });
  //setting next block to the most recent block
  nextBlock = blockchain.chain[blockchain.chain.length - 1];
  //next timestamp is the timestamp of the new block we just set to `nextblock`
  nextTimestamp = nextBlock.timestamp;
  //we are getting the difference in time from the timestamps to determine creation time
  timeDiff = nextTimestamp - prevTimestamp;
  //pushing that creation time to our `times` holding array
  times.push(timeDiff);
  //reducer function to be called with the reduce array method
  const reducer = (acc, curr) => acc + curr;
  //determining the avg time it takes to generate a block
  avg = times.reduce(reducer) / times.length;
  //loog the creation process
  console.log(
    `time to mine block: ${timeDiff}ms. Difficulty: ${nextBlock.difficulty}. Avg time: ${avg}ms`
  );
}
