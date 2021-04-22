const crypto = require("crypto");

//spreading our input to convert N* arguments to an array
//we are using crypto native to node to creat our hash constant
//then we are updating it with the update method which takes a string
//then returning the digest in hexadecimal(digest is the reuslt of the hash)
const cryptoHash = (...inputs) => {
  const hash = crypto.createHash("sha256");

  hash.update(inputs.sort().join(' '));

 return hash.digest('hex')


};

module.exports = cryptoHash;
