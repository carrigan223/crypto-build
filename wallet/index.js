const { STARTING_BALANCE } = require("../config"); //importing starting wallet balance
const { ec, cryptoHash } = require("../util/index"); //importing the elliptical curve generator and crypto hash
const Transaction = require("./transaction");
//creating the wallet class including the constructors of `balance` and `keyPair`
class Wallet {
  constructor() {
    //setting initial balance of 1000
    this.balance = STARTING_BALANCE;
    //generating keyPair usinc ellipticl curve
    this.keyPair = ec.genKeyPair();
    //setting the public key to the generated publick key
    //after conversion to hexadecimal
    this.publicKey = this.keyPair.getPublic().encode("hex");
  }

  //uses the built in sign method which we are passing our hashed data to sign
  sign(data) {
    return this.keyPair.sign(cryptoHash(data));
  }
  //method for generating a transaction from `this` wallet
  //throwing an error if insufficient funds
  //otherwise creating a new instance of a transaction
  //note the this keyword refrencing the methods class
  createTransaction({ recipient, amount, chain }) {
    if (chain) {
      this.balance = Wallet.calculateBalance({
        chain,
        address: this.publicKey,
      });
    }

    if (amount > this.balance) {
      throw Error("Amount Exceeds This Wallets Balance");
    }

    return new Transaction({ amount, senderWallet: this, recipient });
  }

  //`calcualteBalance` is reading over the chain and looking for transactions in which
  //the addrees being put through the params match, if succesful in locating that address it
  //is then taking the amount and adding it to the `outputsTotal` once the whole chain has been assesed
  //the outputsTotal is then added to the starting balance
  static calculateBalance({ address, chain }) {
    let outputsTotal = 0;

    for (let i = 1; i < chain.length; i++) {
      const block = chain[i];

      for (let transaction of block.data) {
        const addressOutput = transaction.outputMap[address];

        if (addressOutput) {
          outputsTotal = outputsTotal + addressOutput;
        }
      }
    }

    return STARTING_BALANCE + outputsTotal;
  }
}

module.exports = Wallet;
