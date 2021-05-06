const uuid = require("uuid/v1");

//the `Transaction` class is creating an object with
//unique transaction id along with an output map
class Transaction {
  constructor({ senderWallet, recipient, amount }) {
    this.id = uuid();
    this.outputMap = this.createOutputMap({ senderWallet, recipient, amount });
  }
  //creating an `outputMap` propety which displays the `publickey` of `recipient`
  //along with the `amount` and also the `senderWallet` remaining balance
  createOutputMap({ senderWallet, recipient, amount }) {
    const outputMap = {};

    outputMap[recipient] = amount;
    outputMap[senderWallet.publicKey] = senderWallet.balance - amount;

    return outputMap;
  }
}

module.exports = Transaction;
