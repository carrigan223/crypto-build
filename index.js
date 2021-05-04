const express = require("express"); //importing in express functioin from express model
const Blockchain = require("./blockchain"); //importing blockchain from local files

const app = express(); //initializing app using express function
const blockchain = new Blockchain(); //creating a main blockchain with new instance

//using the get method to send the blockchain as a get response
app.get("/api/blocks", (req, res) => {
  res.json(blockchain.chain);
});

const PORT = 3000;
//using the apps listen method to run on port 3000
app.listen(PORT, () => {
  console.log(`The Application is listening on localhost:${PORT}`);
});
