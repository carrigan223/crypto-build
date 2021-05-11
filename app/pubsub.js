const redis = require("redis"); //importing redis

//test channel
const CHANNELS = {
  TEST: "TEST",
  BLOCKCHAIN: "BLOCKCHAIN",
  TRANSACTION: "TRANSACTION",
};

class PubSub {
  constructor({ blockchain, transactionPool }) {
    //every `pubsub` instance will have local blockchain
    this.blockchain = blockchain;
    this.transactionPool = transactionPool;

    //using the `createClient()` method from redis
    //to create publisher and subscriber
    this.publisher = redis.createClient();
    this.subscriber = redis.createClient();
    //`createClient()` gives subsriber the built in method
    //to allow subscriber to subscribe to `CHANNELS` and all its props
    this.subscribeToChannels();

    //using the `on` method from which takes in message and callback
    this.subscriber.on("message", (channel, message) =>
      this.handleMessage(channel, message)
    );
  }
  //method to log succesful publishing and subscribing
  //if that message is a chain calling replaceChain to validate
  //and update
  handleMessage(channel, message) {
    console.log(`message received. Channel: ${channel} Message: ${message}`);

    const pasrsedMessage = JSON.parse(message);

    switch (channel) {
      case CHANNELS.BLOCKCHAIN:
        this.blockchain.replaceChain(pasrsedMessage, true, () => {
          this.transactionPool.clearBlockhainTransactions({
            chain: pasrsedMessage,
          });
        });
        break;
      case CHANNELS.TRANSACTION:
        this.transactionPool.setTransaction(pasrsedMessage);
        break;
      default:
        return;
    }
  }

  //method for subcribing to `CHANNEL`
  subscribeToChannels() {
    Object.values(CHANNELS).forEach((channel) => {
      this.subscriber.subscribe(channel);
    });
  }
  //calling publish with channel and message as
  //object(helps avoid specifity with the params)
  //`publish()` to avoid message redundancy is using callbacks
  //to first unsubscribe then send message the resubscribe upon
  //completion, this avoids unnescarry logs to sender
  publish({ channel, message }) {
    this.subscriber.unsubscribe(channel, () => {
      this.publisher.publish(channel, message, () => {
        this.subscriber.subscribe(channel);
      });
    });
  }

  //takes care of broadcasting the blockchain
  //`this.blockchain.chain` is an array but must be a string to pass
  broadCastChain() {
    this.publish({
      channel: CHANNELS.BLOCKCHAIN,
      message: JSON.stringify(this.blockchain.chain),
    });
  }

  broadCastTransaction(transaction) {
    this.publish({
      channel: CHANNELS.TRANSACTION,
      message: JSON.stringify(transaction),
    });
  }
}

module.exports = PubSub;
