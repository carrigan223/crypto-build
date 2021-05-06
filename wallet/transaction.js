const uuid = require("uuid/v1");

//the `Transaction` class is creating an object with
//unique transaction id along with an output map
class Transaction {
  constructor({ senderWallet, recipient, amount }) {
    this.id = uuid();
    this.outputMap = this.createOutputMap({ senderWallet, recipient, amount });
    this.input = this.createInput({ senderWallet, outputMap: this.outputMap });
  }
  //creating an `outputMap` propety which displays the `publickey` of `recipient`
  //along with the `amount` and also the `senderWallet` remaining balance
  createOutputMap({ senderWallet, recipient, amount }) {
    const outputMap = {};

    outputMap[recipient] = amount;
    outputMap[senderWallet.publicKey] = senderWallet.balance - amount;

    return outputMap;
  }

  //the `createInput()` is officiating the transaction taking
  //in the `outputMap` and `senderWallet`
  //to generate a signed and timestamped transaction
  createInput({ senderWallet, outputMap }) {
    return {
      timestamp: Date.now(),
      amount: senderWallet.balance,
      address: senderWallet.publicKey,
      signature: senderWallet.sign(outputMap),
    };
  }
}

module.exports = Transaction;
