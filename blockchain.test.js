// blockchain test file
const Blockchain = require("./blockchain");
const Block = require("./block");
const cryptoHash = require("./crypto-hash");

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

      describe("and the block contains a block with a jumped difficulty", () => {
        it("returns false", () => {
          const lastBlock = blockchain.chain[blockchain.chain.length - 1];
          const lastHash = lastBlock.hash;
          const timestamp = Date.now();
          const nonce = 0;
          const data = [];
          const difficulty = lastBlock.difficulty - 3;

          const hash = cryptoHash(lastHash, timestamp, nonce, data, difficulty);

          const badblock = new Block({
            lastHash,
            timestamp,
            nonce,
            hash,
            data,
            difficulty,
          });

          blockchain.chain.push(badblock);

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
    let errorMock, logMock;
    beforeEach(() => {
      errorMock = jest.fn();
      logMock = jest.fn();

      global.console.error = errorMock;
      global.console.log = logMock; //catching logs and errors during dev
    });
    describe("when the new chain is not longer", () => {
      beforeEach(() => {
        newChain.chain[0] = { new: "chain" };
        blockchain.replaceChain(newChain.chain);
      });
      it("does not replace the chain", () => {
        expect(blockchain.chain).toEqual(originalChain);
      });

      it("logs an error message", () => {
        expect(errorMock).toHaveBeenCalled();
      });
    });

    describe("when the new chain is longer", () => {
      beforeEach(() => {
        newChain.addBlock({ data: "Celtics" });
        newChain.addBlock({ data: "Patriots" });
        newChain.addBlock({ data: "Red Sox" });
      });
      describe("and the new chain is invalid", () => {
        beforeEach(() => {
          newChain.chain[2].hash = "incorrect-hash";
          blockchain.replaceChain(newChain.chain);
        });
        it("does not replace the chain", () => {
          newChain.chain[2].hash = "incorrect-hash";
          blockchain.replaceChain(newChain.chain);
          expect(blockchain.chain).toEqual(originalChain);
        });

        it("logs an error message", () => {
          expect(errorMock).toHaveBeenCalled();
        });
      });

      describe("and the chain is valid", () => {
        beforeEach(() => {
          blockchain.replaceChain(newChain.chain);
        });
        it("does replace the chain", () => {
          expect(blockchain.chain).toEqual(newChain.chain);
        });

        it("logs a console message", () => {
          expect(logMock).toHaveBeenCalled();
        });
      });
    });
  });
});
