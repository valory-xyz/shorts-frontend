import Web3 from 'web3';
import {
  // AGENT_FACTORY_ADDRESS,
  AGENT_FACTORY_ABI,
  AGENT_MECH_ABI,
  BLOCKCHAIN_SHORTS_ABI,
  // DEFAULT_MECH_ADDRESS,
  AGENT_REGISTRY_ABI,
  AGENT_REGISTRY_ADDRESS_GNOSIS,
  AGENT_FACTORY_ADDRESS_GNOSIS,
  AGENT_MECH_ADDRESS_GNOSIS,
  AGENT_MULTISIG_ADDRESS_GNOSIS,
  AGENT_REGISTRY_ADDRESS_NEON,
  AGENT_FACTORY_ADDRESS_NEON,
  AGENT_MECH_ADDRESS_NEON,
  AGENT_MULTISIG_ADDRESS_NEON,
  AGENT_REGISTRY_ADDRESS_ZKEVM_POLYGON,
  AGENT_FACTORY_ADDRESS_ZKEVM_POLYGON,
  AGENT_MECH_ADDRESS_ZKEVM_POLYGON,
  AGENT_MULTISIG_ADDRESS_ZKEVM_POLYGON,
  BLOCKCHAIN_SHORTS_ADDRESS_GNOSIS,
  BLOCKCHAIN_SHORTS_ADDRESS_NEON,
  BLOCKCHAIN_SHORTS_ADDRESS_ZKEVM_POLYGON,
  AGENT_REGISTRY_ADDRESS_BASE,
  AGENT_FACTORY_ADDRESS_BASE,
  AGENT_MECH_ADDRESS_BASE,
  AGENT_MULTISIG_ADDRESS_BASE,
  BLOCKCHAIN_SHORTS_ADDRESS_BASE,
} from 'common-util/AbiAndAddresses';
import { getChainId, getProvider } from 'common-util/functions';
import { base, gnosis, neonMainnet, polygonZkEvm } from 'wagmi/chains';

export const RPC_URLS = {
  100: process.env.NEXT_PUBLIC_GNOSIS_URL,
  245_022_934: process.env.NEXT_PUBLIC_NEON_URL,
  1_101: process.env.NEXT_PUBLIC_ZKEVM_POLYGON_URL,
  8453: process.env.NEXT_PUBLIC_BASE_URL,
};

export const SCAN_URLS = {
  100: gnosis.blockExplorers.etherscan.url,
  245_022_934: neonMainnet.blockExplorers.default.url,
  1_101: polygonZkEvm.blockExplorers.default.url,
  8453: base.blockExplorers.default.url,
};

export const SCAN_ROUTES = {
  100: '/nft',
  8453: '/token', // basescan does not currently support /nft route
};

export const SCAN_SUPPORTS_NFT_ID = {
  100: true,
  8453: false,
};

export const CHAIN_NAMES = {
  100: gnosis.name,
  245_022_934: neonMainnet.name,
  1_101: polygonZkEvm.name,
  8453: base.name,
};

export const AGENT_URLS = {
  100: process.env.NEXT_PUBLIC_AGENT_GNOSIS_URL,
  8453: process.env.NEXT_PUBLIC_AGENT_BASE_URL,
  1_101: process.env.NEXT_PUBLIC_AGENT_ZKEVM_POLYGON_URL,
  245_022_934: process.env.NEXT_PUBLIC_AGENT_NEON_URL,
};

export const ADDRESSES = {
  100: {
    agentRegistry: AGENT_REGISTRY_ADDRESS_GNOSIS,
    agentFactory: AGENT_FACTORY_ADDRESS_GNOSIS,
    defaultMech: AGENT_MECH_ADDRESS_GNOSIS,
    agentMultisig: AGENT_MULTISIG_ADDRESS_GNOSIS,
    blockchainShorts: BLOCKCHAIN_SHORTS_ADDRESS_GNOSIS,
  },
  245_022_934: {
    agentRegistry: AGENT_REGISTRY_ADDRESS_NEON,
    agentFactory: AGENT_FACTORY_ADDRESS_NEON,
    defaultMech: AGENT_MECH_ADDRESS_NEON,
    agentMultisig: AGENT_MULTISIG_ADDRESS_NEON,
    blockchainShorts: BLOCKCHAIN_SHORTS_ADDRESS_NEON,
  },
  1_101: {
    agentRegistry: AGENT_REGISTRY_ADDRESS_ZKEVM_POLYGON,
    agentFactory: AGENT_FACTORY_ADDRESS_ZKEVM_POLYGON,
    defaultMech: AGENT_MECH_ADDRESS_ZKEVM_POLYGON,
    agentMultisig: AGENT_MULTISIG_ADDRESS_ZKEVM_POLYGON,
    blockchainShorts: BLOCKCHAIN_SHORTS_ADDRESS_ZKEVM_POLYGON,
  },
  8453: {
    agentRegistry: AGENT_REGISTRY_ADDRESS_BASE,
    agentFactory: AGENT_FACTORY_ADDRESS_BASE,
    defaultMech: AGENT_MECH_ADDRESS_BASE,
    agentMultisig: AGENT_MULTISIG_ADDRESS_BASE,
    blockchainShorts: BLOCKCHAIN_SHORTS_ADDRESS_BASE,
  },
};

const getWeb3Details = () => {
  const web3 = new Web3(getProvider());
  const chainId = getChainId();
  const address = ADDRESSES[chainId];
  return { web3, address, chainId };
};

export const getBlockchainShortsAddress = (id, chainId) => {
  const url = SCAN_URLS[chainId];
  const route = SCAN_ROUTES[chainId];
  const address = ADDRESSES[chainId]?.blockchainShorts;
  const idSuffix = SCAN_SUPPORTS_NFT_ID[chainId] ? `/${id}` : '';
  return `${url}${route}/${address}${idSuffix}`;
};

const getContract = (abi, contractAddress, web3) => {
  const contract = new web3.eth.Contract(abi, contractAddress);
  return contract;
};

export const getBlockchainShortsContract = () => {
  const { web3, address } = getWeb3Details();
  const contract = getContract(
    BLOCKCHAIN_SHORTS_ABI,
    address.blockchainShorts,
    web3,
  );
  return contract;
};

export const getAgentURL = (defaultChainId = 100) => {
  const { chainId } = defaultChainId
    ? { chainId: defaultChainId }
    : getWeb3Details();
  return AGENT_URLS[chainId];
};

export const getAgentMultisig = () => {
  const { address } = getWeb3Details();
  return address.agentMultisig;
};

export const getAgentContract = () => {
  const { web3, address } = getWeb3Details();
  const contract = getContract(AGENT_REGISTRY_ABI, address.agentRegistry, web3);
  return contract;
};

export const getMechMinterContract = () => {
  const { web3, address } = getWeb3Details();
  const contract = getContract(AGENT_FACTORY_ABI, address.agentFactory, web3);
  return contract;
};

export const getMechContract = () => {
  const { web3, address } = getWeb3Details();
  const contract = getContract(AGENT_MECH_ABI, address.defaultMech, web3);
  return contract;
};
