// blockchain test file

const Blockchain = require("./blockchain");
const Block = require("./block");

describe("blockchain", () => {
  let blockchain = new Blockchain();
  beforeEach(() => {
    blockchain = new Blockchain();
  });
  it("contains a `chain` array", () => {
    expect(blockchain.chain instanceof Array).toBe(true);
  });

  it("starts with a genesis block", () => {
    expect(blockchain.chain[0]).toEqual(Block.genesis());
  });

  it("adds a new block to the chain", () => {
    const newData = "test data";
    blockchain.addBlock({ data: newData });

    expect(blockchain.chain[blockchain.chain.length - 1].data).toEqual(newData);
  });

  describe("isValidChain", () => {
    describe("when the chain does not start with a genesis block", () => {
      it("returns false", () => {
        blockchain.chain[0] = { data: "fake genesis" };

        expect(Blockchain.isValidChain(blockchain.chain)).toBe(false);
      });
    });

    describe("when the chain starts with genesis and has multiple blocks", () => {
      beforeEach(() => {
        blockchain.addBlock({ data: "Beets" });
        blockchain.addBlock({ data: "patriotsd" });
        blockchain.addBlock({ data: "RedSox" });
      });
      describe("a last hash refrence has changed", () => {
        it("returns false", () => {
          blockchain.chain[2].lastHash = "broken-lasthash";

          expect(Blockchain.isValidChain(blockchain.chain)).toBe(false);
        });
      });

      describe("and the chain contains a block with invalid field", () => {
        it("returns false", () => {
          blockchain.chain[2].data = "bad-and-evil-data";

          expect(Blockchain.isValidChain(blockchain.chain)).toBe(false);
        });
      });

      describe("and the chain has no invalid blocks", () => {
        it("returns true", () => {
          expect(Blockchain.isValidChain(blockchain.chain)).toBe(true);
        });
      });
    });
  });
});
