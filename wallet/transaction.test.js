const Wallet = require(".");
const { verifySignature } = require("../util");
const Transaction = require("./transaction");

describe("Transaction", () => {
  let transaction, senderWallet, recipient, amount;

  beforeEach(() => {
    senderWallet = new Wallet();
    recipient = "recipient publicKey";
    amount = 100;

    transaction = new Transaction({ senderWallet, recipient, amount });
  });

  it("has an `id`", () => {
    expect(transaction).toHaveProperty("id");
  });

  describe("`outputMap`", () => {
    it("has an `outputMap`", () => {
      expect(transaction).toHaveProperty("outputMap");
    });

    it("outpust the `amount` to the recipient", () => {
      expect(transaction.outputMap[recipient]).toEqual(amount);
    });

    it("outpust the remaining balance for `senderWallet", () => {
      expect(transaction.outputMap[senderWallet.publicKey]).toEqual(
        senderWallet.balance - amount
      );
    });
  });

  describe("input", () => {
    it("has an `input`", () => {
      expect(transaction).toHaveProperty("input");
    });

    it("has `timestamp` in input", () => {
      expect(transaction.input).toHaveProperty("timestamp");
    });

    it("sets the `amount` to the `senderWallet` balance", () => {
      expect(transaction.input.amount).toEqual(senderWallet.balance);
    });

    it("sets the `address` to the `senderWallet` publicKey", () => {
      expect(transaction.input.address).toEqual(senderWallet.publicKey);
    });

    it("signs the input", () => {
      expect(
        verifySignature({
          publicKey: senderWallet.publicKey,
          data: transaction.outputMap,
          signature: transaction.input.signature,
        })
      ).toBe(true);
    });
  });

  describe("`validTransaction()`", () => {
    let errorMock;

    beforeEach(() => {
      errorMock = jest.fn();

      global.console.error = errorMock;
    });

    describe("is valid transaction", () => {
      it("returns true", () => {
        expect(Transaction.validTransaction(transaction)).toBe(true);
      });
    });

    describe("is not valid transaction", () => {
      describe("and transaction input `outputMap` is invalid", () => {
        it("returns false and logs an error", () => {
          transaction.outputMap[senderWallet.publicKey] = 9999999999;

          expect(Transaction.validTransaction(transaction)).toBe(false);
          expect(errorMock).toHaveBeenCalled();
        });
      });

      describe("and transaction input `signature` is invalid", () => {
        it("returns false and logs an error", () => {
          transaction.input.signature = new Wallet().sign("data");

          expect(Transaction.validTransaction(transaction)).toBe(false);
          expect(errorMock).toHaveBeenCalled();
        });
      });
    });
  });
});
