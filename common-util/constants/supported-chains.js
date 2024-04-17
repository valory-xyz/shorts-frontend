import { gnosis, base } from '@wagmi/core/chains';

export const SUPPORTED_CHAINS = [gnosis, base];

export const DEFAULT_CHAIN = SUPPORTED_CHAINS[0];

export const SUPPORTED_CHAIN_SLUGS = SUPPORTED_CHAINS.map(
  (chain) => chain.network,
);

export const SUPPORTED_CHAIN_SLUG_BY_CHAIN_ID = SUPPORTED_CHAINS.reduce(
  (acc, chain) => ({
    ...acc,
    [chain.id]: chain.network,
  }),
  {},
);

export const SUPPORTED_CHAIN_ID_BY_CHAIN_SLUG = SUPPORTED_CHAINS.reduce(
  (acc, chain) => ({
    ...acc,
    [chain.network]: chain.id,
  }),
  {},
);
