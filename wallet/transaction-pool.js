class TransactionPool {
  constructor() {
    this.transactionMap = {};
  }
  //`setTransaction` can both add a transaction or update due to use of transaction id
  setTransaction(transaction) {
    this.transactionMap[transaction.id] = transaction;
  }
  setMap(transacationMap) {
    this.transactionMap = transacationMap;
  }
  //we are generating an array of transactions then using the find() method
  //to find any existing transactions
  existingTransaction({ inputAddress }) {
    const transactions = Object.values(this.transactionMap);

    return transactions.find(
      (transaction) => transaction.input.address === inputAddress
    );
  }
}

module.exports = TransactionPool;
