const redis = require("redis"); //importing redis

//test channel
const CHANNELS = {
  TEST: "TEST",
  BLOCKCHAIN: "BLOCKCHAIN",
};

class PubSub {
  constructor({ blockchain }) {
    //every `pubsub` instance will have local blockchain
    this.blockchain = blockchain;

    //using the `createClient()` method from redis
    //to create publisher and subscriber
    this.publisher = redis.createClient();
    this.subscriber = redis.createClient();
    //`createClient()` gives subsriber the built in method
    //to allow subscriber to subscribe to `CHANNELS` and all its props
    this.subscribeToChannels();
    // this.subscriber.subscribe(CHANNELS.TEST);
    // this.subscriber.subscribe(CHANNELS.BLOCKCHAIN);
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

    if (channel === CHANNELS.BLOCKCHAIN) {
      this.blockchain.replaceChain(pasrsedMessage);
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
  publish({ channel, message }) {
    this.publisher.publish(channel, message);
  }

  //takes care of broadcasting the blockchain
  //`this.blockchain.chain` is an array but must be a string to pass
  broadCastChain() {
    this.publish({
      channel: CHANNELS.BLOCKCHAIN,
      message: JSON.stringify(this.blockchain.chain),
    });
  }
}

module.exports = PubSub;
