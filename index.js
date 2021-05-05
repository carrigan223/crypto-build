const express = require("express"); //importing in express functioin from express model
// const bodyParser = require("body-parser");//importing JSON body parser middleware
const Blockchain = require("./blockchain"); //importing blockchain from local files
const PubSub = require("./pubsub"); //importing local pubsub class

const app = express(); //initializing app using express function
const blockchain = new Blockchain(); //creating a main blockchain with new instance
const pubsub = new PubSub({ blockchain }); //creating new instance of `PubSub` class

setTimeout(() => pubsub.broadCastChain(), 1000);

app.use(express.json());

//using the get method to send the blockchain instance as a get response
app.get("/api/blocks", (req, res) => {
  res.json(blockchain.chain);
});
//using post method to be able to add blocks to the chain
app.post("/api/mine", (req, res) => {
  //destructuring the data prop from request body
  const { data } = req.body;
  //using `Blockchains` `addBlock()` method to take
  //the data from the request body and add a new block
  blockchain.addBlock({ data });
  //redirecting to `api/blocks` to view added block
  res.redirect("/api/blocks");
});

const PORT = 3000;
//using the apps listen method to run on port 3000
app.listen(PORT, () => {
  console.log(`The Application is listening on localhost:${PORT}`);
});
