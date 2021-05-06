//EC is the package for generating an elliptic curve
//to base our cryptographicly secure key generation off of
const EC = require("elliptic").ec;
const ec = new EC("secp256k1");//research `secp256k1` 
const cryptoHash = require("./crypto-hash");

//utility function for verifying the signature is true and accurate
const verifySignature = ({ data, signature, publicKey, privateKey }) => {
  const keyFromPublic = ec.keyFromPublic(publicKey, "hex");
  return keyFromPublic.verify(cryptoHash(data), signature);
};

module.exports = { ec, verifySignature };
