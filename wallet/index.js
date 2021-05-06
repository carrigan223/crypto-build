const { STARTING_BALANCE } = require("../config"); //importing starting wallet balance
const cryptoHash = require("../util/crypto-hash");//importing cryptoHash function
const { ec } = require("../util/index"); //importing the elliptical curve generator

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
}

module.exports = Wallet;
