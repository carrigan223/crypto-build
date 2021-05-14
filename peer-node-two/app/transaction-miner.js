const Transaction = require("../wallet/transaction");

class TransactionMiner {
  constructor({ blockchain, wallet, pubSub, transactionPool }) {
    this.blockchain = blockchain;
    this.transactionPool = transactionPool;
    this.wallet = wallet;
    this.pubSub = pubSub;
  }

  //`mineTransaction()` is collecting the valid transaction
  //then generating the miners reward before adding the block to
  //the blochain then broadcasting and clearing the local transaction pool
  mineTransaction() {
    const validTransactions = this.transactionPool.validTransactions();
    validTransactions.push(
      Transaction.rewardTransaction({ minerWallet: this.wallet })
    );
    this.blockchain.addBlock({ data: validTransactions });
    this.pubSub.broadCastChain();
    this.transactionPool.clear();
  }
}

module.exports = TransactionMiner;
