const express = require("express"); //importing in express functioin from express model
const request = require("request"); //importing request from request
// const bodyParser = require("body-parser");//importing JSON body parser middleware
const Blockchain = require("./blockchain"); //importing blockchain from local files
const PubSub = require("./app/pubsub"); //importing local pubsub class

const app = express(); //initializing app using express function
const blockchain = new Blockchain(); //creating a main blockchain with new instance
const pubsub = new PubSub({ blockchain }); //creating new instance of `PubSub` class

const DEFAULT_PORT = 3000; //declaring our default port

const ROOT_NODE_ADDRESS = `http://localhost:${DEFAULT_PORT}`;

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
  //adding a call so `pubsub` broadcasts chain right away
  pubsub.broadCastChain();

  //redirecting to `api/blocks` to view added block
  res.redirect("/api/blocks");
});

let PEER_PORT;
//setting `PEER_PORT` to random value from 1 - 1000
if (process.env.GENERATE_PEER_PORT === "true") {
  PEER_PORT = DEFAULT_PORT + Math.ceil(Math.random() * 1000);
}
//function to sync chains upon peer joining
//making an http request, if no errors we are
//receiveing the root chain in the body than parsing the json
//object and passing it to the blockchain `replaceChain()` method
const syncChains = () => {
  request(
    { url: `${ROOT_NODE_ADDRESS}/api/blocks` },
    (error, response, body) => {
      if (!error && response.statusCode === 200) {
        const rootChain = JSON.parse(body);

        console.log("Replace chain on sync with:", rootChain);
        blockchain.replaceChain(rootChain);
      }
    }
  );
};

//if `PEER_PORT` is undefined set back to default
const PORT = PEER_PORT || DEFAULT_PORT;
//using the apps listen method to run on default or peer port
//once listening we are immediatly calling `syncChains()` to get the
//most current chain if run on `PEER_PORT`
app.listen(PORT, () => {
  console.log(`The Application is listening on localhost:${PORT}`);

  if (PORT !== DEFAULT_PORT) {
    syncChains();
  }
});
