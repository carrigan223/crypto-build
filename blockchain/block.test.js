const hexToBinary = require("hex-to-binary");
const Block = require("./block");
const { GENESIS_DATA, MINE_RATE } = require("../config");
const { cryptoHash } = require("../util/index");

//describe is a jest function to test
//it takes to params, the name and then a callback function

describe("Block", () => {
  const timestamp = 2000;
  const lastHash = "lastHash-test";
  const hash = "hash-test";
  const data = ["block", "data"];
  const nonce = 1;
  const difficulty = 1;
  const block = new Block({
    timestamp,
    lastHash,
    hash,
    data,
    nonce,
    difficulty,
  });
  //takes two params description and callback for what its looking for
  it("has timestamp, hash, lasthash, and data props", () => {
    expect(block.timestamp).toEqual(timestamp);
    expect(block.lastHash).toEqual(lastHash);
    expect(block.hash).toEqual(hash);
    expect(block.data).toEqual(data);
    expect(block.nonce).toEqual(nonce);
    expect(block.difficulty).toEqual(difficulty);
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
        cryptoHash(
          minedBlock.timestamp,
          minedBlock.nonce,
          minedBlock.difficulty,
          lastBlock.hash,
          data
        )
      );
    });

    it("adjusts the difficulty", () => {
      const possibleDifficulty = [
        lastBlock.difficulty + 1,
        lastBlock.difficulty - 1,
      ];
      expect(possibleDifficulty.includes(minedBlock.difficulty)).toEqual(true);
    });

    it("sets a `hash` that matches difficulty criteria", () => {
      expect(
        hexToBinary(minedBlock.hash).substring(0, minedBlock.difficulty)
      ).toEqual("0".repeat(minedBlock.difficulty));
    });
  });

  describe("adjustDifficulty()", () => {
    it("it raises the difficulty for a quickly mined block", () => {
      expect(
        Block.adjustDifficulty({
          originalBlock: block,
          timestamp: block.timestamp + MINE_RATE - 100,
        })
      ).toEqual(block.difficulty + 1);
    });

    it("it lowers the difficulty for a slowly mined block", () => {
      expect(
        Block.adjustDifficulty({
          originalBlock: block,
          timestamp: block.timestamp + MINE_RATE + 100,
        })
      ).toEqual(block.difficulty - 1);
    });

    it("has a lower limit of 1", () => {
      block.difficulty = -1;
      expect(Block.adjustDifficulty({ originalBlock: block })).toEqual(1);
    });
  });
});
