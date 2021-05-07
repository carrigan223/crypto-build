class TransactionMiner {
  constructor({ blockchain, wallet, pubSub, transactionPool }) {
    this.blockchain = blockchain;
    this.transactionPool = transactionPool;
    this.wallet = wallet;
    this.pubSub = pubSub;
  }
  mineTransaction() {
    //get the transaction pools valid transactions
    //generate the miners reward
    //add a block consisting of these transaction
    //broadcast updated blockchain
    //clear transaction pool
  }
}

module.exports = TransactionMiner;
