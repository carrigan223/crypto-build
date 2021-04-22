const Block = require("./block");
const { GENESIS_DATA } = require("./config");
const cryptoHash = require("./crypto-hash");

//describe is a jest function to test
//it takes to params, the name and then a callback function

describe("Block", () => {
  const timestamp = "time-test";
  const lastHash = "lastHash-test";
  const hash = "hash-test";
  const data = ["block", "data"];
  const block = new Block({
    timestamp,
    lastHash,
    hash,
    data,
  });
  //takes two params description and callback for what its looking for
  it("has timestamp, hash, lasthash, and data props", () => {
    expect(block.timestamp).toEqual(timestamp);
    expect(block.lastHash).toEqual(lastHash);
    expect(block.hash).toEqual(hash);
    expect(block.data).toEqual(data);
  });

  describe("genesis()", () => {
    const genesisBlock = Block.genesis();

    it("returns a block instance", () => {
      expect(genesisBlock instanceof Block).toBe(true);
    });

    it("returns the genesis data", () => {
      expect(genesisBlock).toEqual(GENESIS_DATA);
    });
  });

  describe("mineblock()", () => {
    const lastBlock = Block.genesis();
    const data = "mined data";
    const minedBlock = Block.mineBlock({ lastBlock, data });

    it("returns a block instance", () => {
      expect(minedBlock instanceof Block).toBe(true);
    });

    it("sets `lastHash` to be the `hash` of the last block", () => {
      expect(minedBlock.lastHash).toEqual(lastBlock.hash);
    });

    it("sets the data", () => {
      expect(minedBlock.data).toEqual(data);
    });

    it("sets a timestamp", () => {
      expect(minedBlock.timestamp).not.toEqual(undefined);
    });

    it("creates a sha256 hash based on the proper inputs", () => {
      expect(minedBlock.hash).toEqual(
        cryptoHash(minedBlock.timestamp, lastBlock.hash, data)
      );
    });
  });
});
