const Wallet = require("./index");
const Transaction = require("./transaction");
const { verifySignature } = require("../util/index");

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
});
