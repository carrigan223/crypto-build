const express = require("express"); //importing in express functioin from express model
const request = require("request"); //importing request from request
const path = require("path");
// const bodyParser = require("body-parser");//importing JSON body parser middleware
const Blockchain = require("./blockchain"); //importing blockchain from local files
const PubSub = require("./app/pubsub"); //importing local pubsub class
const TransactionPool = require("./wallet/transaction-pool"); //importing local TransactionPool class
const Wallet = require("./wallet/index"); //importing local wallet class
const TransactionMiner = require("./app/transaction-miner"); //importing transaction miner class

const isDevelopment = process.env.ENV === "development";

const REDIS_URL = isDevelopment
  ? "redis://127.0.0.1:6379"
  : "redis://:p30cc2c8c9ccb5feef9234900b271d519f805a18d7beb51351a405db5e65c5ed7@ec2-3-227-31-103.compute-1.amazonaws.com:31589";
const DEFAULT_PORT = 3000; //declaring our default port
const ROOT_NODE_ADDRESS = `http://localhost:${DEFAULT_PORT}`;

const app = express(); //initializing app using express function
const blockchain = new Blockchain(); //creating a main blockchain with new instance
const transactionPool = new TransactionPool(); //initialinzing transaction pool
const wallet = new Wallet(); //initializing new wallet class
const pubSub = new PubSub({ blockchain, transactionPool, redisUrl: REDIS_URL }); //creating new instance of `PubSub` class
const transactionMiner = new TransactionMiner({
  blockchain,
  transactionPool,
  wallet,
  pubSub,
}); //initializng a Miner

app.use(express.json());
app.use(express.static(path.join(__dirname, "client/dist")));

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
  pubSub.broadCastChain();

  //redirecting to `api/blocks` to view added block
  res.redirect("/api/blocks");
});

//post request to allow official transaction using wallet
app.post("/api/transact", (req, res) => {
  //detructuring the amount and recipient
  const { amount, recipient } = req.body;

  //checking if new or existing transaction
  let transaction = transactionPool.existingTransaction({
    inputAddress: wallet.publicKey,
  });

  //using those values to creat a transaction with the wallets method
  //assuming no errors(checking with try block) and new transaction o
  //therwise we are updateing existing
  try {
    if (transaction) {
      transaction.update({ senderWallet: wallet, recipient, amount });
    } else {
      transaction = wallet.createTransaction({
        recipient,
        amount,
        chain: blockchain.chain,
      });
    }
  } catch (error) {
    return res.status(400).json({ type: "error", message: error.message });
  }

  //setting that transaction to the pool
  transactionPool.setTransaction(transaction);

  //broadcasting the transaction to all subscribers
  pubSub.broadCastTransaction(transaction);

  //senders response is the transaction object
  res.json({ type: "success", transaction });
});

//GET method for retrieving transaction pool
app.get("/api/transaction-pool-map", (req, res) => {
  res.json(transactionPool.transactionMap);
});

app.get("/api/mine-transactions", (req, res) => {
  transactionMiner.mineTransaction();

  res.redirect("/api/blocks");
});

app.get("/api/wallet-info", (req, res) => {
  const address = wallet.publicKey;

  res.json({
    address,
    balance: Wallet.calculateBalance({
      chain: blockchain.chain,
      address,
    }),
  });
});

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "./client/dist/index.html"));
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
const syncWithRootState = () => {
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

  request(
    { url: `${ROOT_NODE_ADDRESS}/api/transaction-pool-map` },
    (error, response, body) => {
      if (!error && response.statusCode === 200) {
        const rootTransactionPoolMap = JSON.parse(body);

        console.log(
          "Replace Transaction-pool-map on sync with:",
          rootTransactionPoolMap
        );
        transactionPool.setMap(rootTransactionPoolMap);
      }
    }
  );
};

//TEST DATA

const walletFoo = new Wallet();
const walletBar = new Wallet();

if (isDevelopment) {
  const generateWalletTransaction = ({ wallet, recipient, amount }) => {
    const transaction = wallet.createTransaction({
      recipient,
      amount,
      chain: blockchain.chain,
    });

    transactionPool.setTransaction(transaction);
  };

  const walletAction = () =>
    generateWalletTransaction({
      wallet,
      recipient: walletFoo.publicKey,
      amount: 5,
    });

  const walletFooAction = () =>
    generateWalletTransaction({
      wallet: walletFoo,
      recipient: walletBar.publicKey,
      amount: 10,
    });

  const walletBarAction = () =>
    generateWalletTransaction({
      wallet: walletBar,
      recipient: wallet.publicKey,
      amount: 15,
    });

  for (let i = 0; i < 10; i++) {
    if (i % 3 === 0) {
      walletAction();
      walletFooAction();
    } else if (i % 3 === 1) {
      walletAction();
      walletBarAction();
    } else {
      walletFooAction();
      walletBarAction();
    }

    transactionMiner.mineTransaction();
  }
}
//TEST DATA

//if `PEER_PORT` is undefined set back to default
const PORT = process.env.PORT || PEER_PORT || DEFAULT_PORT;
//using the apps listen method to run on default or peer port
//once listening we are immediatly calling `syncWithRootState()` to get the
//most current chain if run on `PEER_PORT`
app.listen(PORT, () => {
  console.log(`The Application is listening on localhost:${PORT}`);

  if (PORT !== DEFAULT_PORT) {
    syncWithRootState();
  }
});
