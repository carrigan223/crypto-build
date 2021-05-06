//EC is the package for generating an elliptic curve
//to base our cryptographicly secure key generation off of
const EC = require("elliptic").ec;

const ec = new EC("secp256k1");

module.exports = { ec };
