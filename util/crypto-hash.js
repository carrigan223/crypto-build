const crypto = require("crypto");

//spreading our input to convert N* arguments to an array
//we are using crypto native to node to creat our hash constant
//then we are updating it with the update method which takes a string
//then returning the digest in hexadecimal(digest is the reuslt of the hash)
//also stringifying all the inputs so the new inputs register and we view the properties
//due to JS behavior not regestering the object change when underlying props change
const cryptoHash = (...inputs) => {
  const hash = crypto.createHash("sha256");

  hash.update(
    inputs
      .map((input) => JSON.stringify(input))
      .sort()
      .join(" ")
  );

  return hash.digest("hex");
};

module.exports = cryptoHash;
