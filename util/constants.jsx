export const LOCAL_CHAIN_ID = 31337;

export const HASH_PREFIX = 'f01701220';
export const HASH_PREFIXES = {
  type1: HASH_PREFIX,
  type2: 'bafybei',
};

export const GATEWAY_URL = 'https://gateway.autonolas.tech/ipfs/';

// QUEUE_THRESHOLD represents the limit above which special handling for queueing may be required
export const QUEUE_THRESHOLD = 9000;

// TODO: move to autonolas-frontend-library
export const EXTRA_COLORS = {
  YELLOW_PRIMARY: '#eab308', // tailwind orange.500
  YELLOW_SECONDARY: '#fefce8', // tailwind orange.50
};

export const PAGES_TO_LOAD_WITHOUT_CHAINID = ['/disclaimer', '/dev'];
