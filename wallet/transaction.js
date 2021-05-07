const uuid = require("uuid/v1");
const { verifySignature } = require("../util");

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

  //static method verifying the transaction as true and accurate
  //we are taking in the `transaction` and destructuring to obtain the
  //`outputMap` and the `input` which we are destructuring, we are taking the values of
  //outputMap to verify the remaining balance + transacation amount values reduced to
  //equal original balance we are then verifying the signature is valid and hasnt
  //been tampered, if checks do not pass the errors will log, otherwise we will
  //return true on assesment of valid transaction
  static validTransaction(transaction) {
    const {
      input: { address, amount, signature },
      outputMap,
    } = transaction;

    const outputTotal = Object.values(outputMap).reduce(
      (total, outputAmount) => total + outputAmount
    );

    if (amount !== outputTotal) {
      console.error(`Invalid transaction from ${address}`);
      return false;
    }

    if (!verifySignature({ publicKey: address, data: outputMap, signature })) {
      console.error(`Invalid signature from ${address}`);
      return false;
    }

    return true;
  }

  //the update method is takeing in the `senderWallet` the destination `recipient`
  //and the transaction `amount`, we are then verifying the `senderWallet` has a sufficient balance
  //to make the transaction. we are then checking wheter this `recipient` is an existing `recipient`
  //or a new recipient and setting the `amount` or if existing updating the `amount`
  //we are then subtracting the transaction amount from the senders balance and creating a new
  //input and to give the transaction a signature
  update({ senderWallet, recipient, amount }) {
    if (amount > this.outputMap[senderWallet.publicKey]) {
      throw new Error("This Amount Exceeds This Wallets Balance");
    }

    if (!this.outputMap[recipient]) {
      this.outputMap[recipient] = amount;
    } else {
      this.outputMap[recipient] = this.outputMap[recipient] + amount;
    }

    this.outputMap[senderWallet.publicKey] =
      this.outputMap[senderWallet.publicKey] - amount;

    this.input = this.createInput({ senderWallet, outputMap: this.outputMap });
  }
}

module.exports = Transaction;
