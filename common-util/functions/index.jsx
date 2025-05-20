import { GATEWAY_URL } from 'util/constants';
import { ADDRESSES, RPC_URLS } from 'common-util/Contracts';
import {
  getProvider as getProviderFn,
  getChainIdOrDefaultToMainnet as getChainIdOrDefaultToMainnetFn,
  getIsValidChainId as getIsValidChainIdFn,
  sendTransaction as sendTransactionFn,
} from '@autonolas/frontend-library';
import {
  DEFAULT_CHAIN_ID,
  SUPPORTED_CHAINS,
  SUPPORTED_CHAIN_ID_BY_CHAIN_SLUG,
} from '../constants/supported-chains';

export const getProvider = () => getProviderFn(SUPPORTED_CHAINS, RPC_URLS);

export const getIsValidChainId = (chainId) =>
  getIsValidChainIdFn(SUPPORTED_CHAINS, chainId);

export const getChainIdOrDefaultToMainnet = (chainId) => {
  const x = getChainIdOrDefaultToMainnetFn(SUPPORTED_CHAINS, chainId);
  return x;
};

export const getChainId = (chainId = null) => {
  if (chainId) return chainId;

  // chainId fetched from sessionStorage
  const chainIdFromSessionStorage =
    typeof sessionStorage === 'undefined'
      ? 1
      : Number(sessionStorage.getItem('chainId'));

  // if chainId is not supported, throw error
  if (!SUPPORTED_CHAINS.find((e) => e.id === chainIdFromSessionStorage)) {
    return new Error('Invalid chain id');
  }

  return chainIdFromSessionStorage || DEFAULT_CHAIN_ID;
};

export const sendTransaction = (fn, account) =>
  sendTransactionFn(fn, account, {
    supportedChains: SUPPORTED_CHAINS,
    rpcUrls: RPC_URLS,
  });

export const getSupportedNetworks = () =>
  Object.keys(ADDRESSES).map((e) => Number(e));

export const getIpfsResponse = async (hash, filePath) => {
  try {
    const ipfsUrl = `${GATEWAY_URL}f01701220${hash.substring(2)}${
      filePath ? `/${filePath}` : ''
    }`;
    const response = await fetch(ipfsUrl);
    const json = await response.json();
    return json;
  } catch (e) {
    window.console.error('Error fetching metadata from IPFS', e);
    throw new Error(e);
  }
};

// show last element of agentHashes array
export const getAgentHash = (agentHashes = []) =>
  agentHashes.length === 0 ? '' : agentHashes[agentHashes.length - 1];

/**
 * Converts seconds into a human-readable format of hours and minutes.
 * If the total seconds are less than an hour, only minutes are displayed.
 * @param {number} seconds - The number of seconds to convert.
 * @returns {string} - A string representing the time in hours and minutes.
 */
export const secondsToHms = (seconds) => {
  if (seconds === undefined || seconds === null) return '-- minutes';

  return `${seconds >= 3600 ? `${Math.floor(seconds / 3600)} hours ` : ''}${Math.floor(
    (seconds % 3600) / 60,
  )} minutes`;
};
export const validateNetworkQuery = ({ network, strict = false }) => {
  if (!network && !strict) return true;
  return SUPPORTED_CHAIN_ID_BY_CHAIN_SLUG[network] !== undefined;
};
