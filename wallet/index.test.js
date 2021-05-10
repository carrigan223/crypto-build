const Wallet = require("./index");
const Transaction = require("./transaction");
const Blockchain = require("../blockchain/index");
const { verifySignature } = require("../util/index");
const { STARTING_BALANCE } = require("../config");

describe("Wallet", () => {
  let wallet;

  beforeEach(() => {
    wallet = new Wallet();
  });

  it("has a `balance`", () => {
    expect(wallet).toHaveProperty("balance");
  });

  it("has a publicKey", () => {
    expect(wallet).toHaveProperty("publicKey");
  });

  describe("signing data", () => {
    const data = "test";

    it("verifies a signature", () => {
      expect(
        verifySignature({
          publicKey: wallet.publicKey,
          signature: wallet.sign(data),
          data,
        })
      ).toBe(true);
    });

    it("does not verifies a signature", () => {
      expect(
        verifySignature({
          publicKey: wallet.publicKey,
          privateKey: wallet.privateKey,
          signature: new Wallet().sign(),
          data,
        })
      ).toBe(false);
    });
  });

  describe("createTransaction()", () => {
    describe("the amount exceeds the balance", () => {
      it("throws an error as result", () => {
        expect(() =>
          wallet.createTransaction({
            amount: 999999,
            recipient: "test recipient",
          })
        ).toThrow("Amount Exceeds This Wallets Balance");
      });
    });

    describe("the amount is valid", () => {
      let transaction, amount, recipient;

      beforeEach(() => {
        amount = 50;
        transaction = wallet.createTransaction({ amount, recipient });
        recipient = "test recipient";
      });

      it("creates an instance of `transaction`", () => {
        expect(transaction instanceof Transaction).toBe(true);
      });

      it("outputs the amount to recipient", () => {
        expect(transaction.input.address).toEqual(wallet.publicKey);
      });

      it("matches the transaction input with the wallet", () => {
        expect(transaction.outputMap[recipient]).toEqual(amount);
      });
    });
  });

  describe("calculateBalance()", () => {
    let blockchain;

    beforeEach(() => {
      blockchain = new Blockchain();
    });

    describe("and there are no outputs for the wallet", () => {
      it("returns the `STARTING_BALANCE`", () => {
        expect(
          Wallet.calculateBalance({
            chain: blockchain.chain,
            address: wallet.publicKey,
          })
        ).toEqual(STARTING_BALANCE);
      });
    });

    describe("and there are outputs for the wallet", () => {
      let transactionOne, transactionTwo;

      beforeEach(() => {
        transactionOne = new Wallet().createTransaction({
          recipient: wallet.publicKey,
          amount: 50,
        });

        transactionTwo = new Wallet().createTransaction({
          recipient: wallet.publicKey,
          amount: 60,
        });

        blockchain.addBlock({ data: [transactionOne, transactionTwo] });
      });

      it("adds the sum of all outputs to the wallet balance", () => {
        expect(
          Wallet.calculateBalance({
            chain: blockchain.chain,
            address: wallet.publicKey,
          })
        ).toEqual(
          STARTING_BALANCE +
            transactionOne.outputMap[wallet.publicKey] +
            transactionTwo.outputMap[wallet.publicKey]
        );
      });
    });
  });
});
