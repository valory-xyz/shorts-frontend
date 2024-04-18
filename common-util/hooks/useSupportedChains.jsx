import { SUPPORTED_CHAIN_SLUG_BY_CHAIN_ID } from '../constants/supported-chains';

export const useSupportedChains = () => {
  const getChainSlug = (chainId) => {
    return SUPPORTED_CHAIN_SLUG_BY_CHAIN_ID[chainId];
  };

  return { getChainSlug };
};
