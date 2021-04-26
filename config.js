//were we store hard hardcoded and global data
//data for the genesis block

const MINE_RATE = 1000;/ WET IN MILLISECONDS
const INITIAL_DIFFICULTY = 3;//initial difficulty factor to take into acount

const GENESIS_DATA = {
  timestamp: 1,
  lastHash: "-------",
  hash: "genesis-hash",
  difficulty: INITIAL_DIFFICULTY,
  nonce: 0,
  data: [],
};

module.exports = { GENESIS_DATA };
