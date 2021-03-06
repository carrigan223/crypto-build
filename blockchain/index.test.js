// blockchain test file
const Blockchain = require(".");
const Block = require("./block");
const Wallet = require("../wallet/index");
const Transaction = require("../wallet/transaction");
const { cryptoHash } = require("../util/index");

describe("Blockchain", () => {
  let blockchain, newChain, originalChain, errorMock;
  beforeEach(() => {
    blockchain = new Blockchain();
    newChain = new Blockchain();
    errorMock = jest.fn();

    originalChain = blockchain.chain;
    global.console.error = errorMock;
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
    let logMock;
    beforeEach(() => {
      logMock = jest.fn();

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

    describe("and the `validateTransactionData` flag is true", () => {
      it("calls `validTransactionData()`", () => {
        const validTransactionDataMock = jest.fn();

        blockchain.validTransactionData = validTransactionDataMock;

        newChain.addBlock({ data: "foo" });
        blockchain.replaceChain(newChain.chain, true);

        expect(validTransactionDataMock).toHaveBeenCalled();
      });
    });
  });

  describe("validTransactionData()", () => {
    let transaction, rewardTransaction, wallet;

    beforeEach(() => {
      wallet = new Wallet();
      transaction = wallet.createTransaction({
        recipient: "foo-address",
        amount: 65,
      });
      rewardTransaction = Transaction.rewardTransaction({
        minerWallet: wallet,
      });
    });

    describe("and the transactioin data is valid", () => {
      it("returns true", () => {
        newChain.addBlock({ data: [transaction, rewardTransaction] });

        expect(blockchain.validTransactionData({ chain: newChain.chain })).toBe(
          true
        );
        expect(errorMock).not.toBeCalled();
      });
    });

    describe("and the transaction data has mulitple rewards", () => {
      it("returns false and logs an error", () => {
        newChain.addBlock({
          data: [transaction, rewardTransaction, rewardTransaction],
        });

        expect(blockchain.validTransactionData({ chain: newChain.chain })).toBe(
          false
        );
        expect(errorMock).toBeCalled();
      });
    });

    describe("and the transaction data has at least one malformed outputMap", () => {
      describe("and the transaction is not a reward transaction", () => {
        it("returns false and logs an error", () => {
          transaction.outputMap[wallet.publicKey] = 999999;

          newChain.addBlock({ data: [transaction, rewardTransaction] });

          expect(
            blockchain.validTransactionData({ chain: newChain.chain })
          ).toBe(false);
          expect(errorMock).toBeCalled();
        });
      });

      describe("and the transaction is a reward transaction", () => {
        it("returns false and logs an error", () => {
          rewardTransaction.outputMap[wallet.publicKey] = 999999;

          newChain.addBlock({ data: [transaction, rewardTransaction] });

          expect(
            blockchain.validTransactionData({ chain: newChain.chain })
          ).toBe(false);
          expect(errorMock).toBeCalled();
        });
      });
    });

    describe("and the transaction data has at least one malformed input", () => {
      it("returns false and logs an error", () => {
        wallet.balance = 9000;

        const evilOutputMap = {
          [wallet.publicKey]: 8900,
          forRecipient: 100,
        };

        const evilTransaction = {
          input: {
            timestamp: Date.now(),
            amount: wallet.balance,
            address: wallet.publicKey,
            signature: wallet.sign(evilOutputMap),
          },
          outputMap: evilOutputMap,
        };

        newChain.addBlock({ data: [evilTransaction, rewardTransaction] });

        expect(blockchain.validTransactionData({ chain: newChain.chain })).toBe(
          false
        );
        expect(errorMock).toBeCalled();
      });
    });

    describe("and a block contains multiple identical transactions", () => {
      it("returns false and logs an error", () => {
        newChain.addBlock({
          data: [transaction, transaction, transaction, rewardTransaction],
        });

        expect(blockchain.validTransactionData({ chain: newChain.chain })).toBe(
          false
        );
        expect(errorMock).toBeCalled();
      });
    });
  });
});
