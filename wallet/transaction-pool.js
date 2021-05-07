class TransactionPool {
  constructor() {
    this.transactionMap = {};
  }
  //`setTransaction` can both add a transaction or update due to use of transaction id

  setTransaction(transaction) {
    this.transactionMap[transaction.id] = transaction;
  }
}

module.exports = TransactionPool;
