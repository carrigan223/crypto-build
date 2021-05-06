const { STARTING_BALANCE } = require("../config"); //importing starting wallet balance
const { ec } = require("../util/index"); //importing the elliptical curve generator

//creating the wallet class including the constructors of `balance` and `keyPair`
class Wallet {
  constructor() {
    //setting initial balance of 1000
    this.balance = STARTING_BALANCE;
    //generating keyPair usinc ellipticl curve
    const keyPair = ec.genKeyPair();
    //setting the public key to the generated publick key
    //after conversion to hexadecimal
    this.publicKey = keyPair.getPublic().encode("hex");
  }
}

module.exports = Wallet;
