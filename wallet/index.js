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
  createTransaction({ recipient, amount }) {
    if (amount > this.balance) {
      throw Error("Amount Exceeds This Wallets Balance");
    }

    return new Transaction({ amount, senderWallet: this, recipient });
  }
}

module.exports = Wallet;
