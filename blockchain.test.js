// blockchain test file
const Blockchain = require("./blockchain");
const Block = require("./block");

describe("Blockchain", () => {
  let blockchain, newChain, originalChain;
  beforeEach(() => {
    blockchain = new Blockchain();
    newChain = new Blockchain();

    originalChain = blockchain.chain;
  });

  it("contains a chain `Array instance`", () => {
    expect(blockchain.chain instanceof Array).toBe(true);
  });
  it("starts with the Genesis block", () => {
    expect(blockchain.chain[0]).toEqual(Block.genesis());
  });
  it("adds a new block to the chain", () => {
    const newData = "test-data";
    //representing the normal block `Object`
    blockchain.addBlock({ data: newData });
    expect(blockchain.chain[blockchain.chain.length - 1].data).toEqual(newData);
  });

  describe("isValidChain()", () => {
    describe("When the chain does not start with the genesis block", () => {
      it("returns false", () => {
        blockchain.chain[0] = { data: "fake genesis" };
        expect(Blockchain.isValidChain(blockchain.chain)).toBe(false);
      });
    });

    describe("When the chain does start with the genesis block and has multiple blocks", () => {
      beforeEach(() => {
        blockchain.addBlock({ data: "Celtics" });
        blockchain.addBlock({ data: "Patriots" });
        blockchain.addBlock({ data: "Red Sox" });
      });

      describe("and lastHash refrence has changed", () => {
        it("returns false", () => {
          blockchain.chain[2].lastHash = "fake-last-hash";
          expect(Blockchain.isValidChain(blockchain.chain)).toBe(false);
        });
      });
      describe("and the chain contains a block with invalid field", () => {
        it("returns false", () => {
          blockchain.chain[2].data = "malicious-data";
          expect(Blockchain.isValidChain(blockchain.chain)).toBe(false);
        });
      });
      describe("and the chain does not contain any invalid blocks", () => {
        it("returns true", () => {
          expect(Blockchain.isValidChain(blockchain.chain)).toBe(true);
        });
      });
    });
  });

  describe("replaceChain()", () => {
    describe("when the new chain is not longer", () => {
      it("does not replace the chain", () => {
        newChain.chain[0] = { new: "chain" };
        blockchain.replaceChain(newChain.chain);
        expect(blockchain.chain).toEqual(originalChain);
      });
    });

    describe("when the new chain is longer", () => {
      beforeEach(() => {
        newChain.addBlock({ data: "Celtics" });
        newChain.addBlock({ data: "Patriots" });
        newChain.addBlock({ data: "Red Sox" });
      });
      describe("and the new chain is invalid", () => {
        it("does not replace the chain", () => {
          newChain.chain[2].hash = "incorrect-hash";
          blockchain.replaceChain(newChain.chain);
          expect(blockchain.chain).toEqual(originalChain);
        });
      });

      describe("and the chain is valid", () => {
        it("does replace the chain", () => {
          blockchain.replaceChain(newChain.chain);
          expect(blockchain.chain).toEqual(newChain.chain);
        });
      });
    });
  });
});
