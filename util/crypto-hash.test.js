const cryptoHash = require("./crypto-hash");

describe("cryptohash()", () => {
  it("generates a hashed output with sha256", () => {
    expect(cryptoHash("foo", "bar")).toEqual(
      "d07fd213348652a6c1f60d3ef50bdc88eaa89d891b5a9aeede323f05669b227f"
    );
  });

  it("produces the same hash with same input in any order", () => {
    expect(cryptoHash("one", "two", "three")).toEqual(
      cryptoHash("three", "one", "two")
    );
  });
});
