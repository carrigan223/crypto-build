//were we store hard hardcoded and global data
//data for the genesis block

const MINE_RATE = 1000; // IN MILLISECONDS
const INITIAL_DIFFICULTY = 3; //initial difficulty factor to take into acount

const GENESIS_DATA = {
  timestamp: 1,
  lastHash: "-------",
  hash: "genesis-hash",
  difficulty: INITIAL_DIFFICULTY,
  nonce: 0,
  data: [],
};

const STARTING_BALANCE = 1000; //initial starting balance on wallet creation

const REWARD_INPUT = { address: "*AUTHORIZED-REWARD*" }; //global constant for hardcoded mining reward address

const MINING_REWARD = 50; //reward for mining a block

module.exports = {
  GENESIS_DATA,
  MINE_RATE,
  STARTING_BALANCE,
  REWARD_INPUT,
  MINING_REWARD,
};
