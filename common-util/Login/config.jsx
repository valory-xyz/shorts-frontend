import {
  EthereumClient,
  w3mConnectors,
  w3mProvider,
} from '@web3modal/ethereum';
import { configureChains, createConfig } from 'wagmi';
import { SafeConnector } from 'wagmi/connectors/safe';
import { publicProvider } from 'wagmi/providers/public';

import { SUPPORTED_CHAINS } from 'common-util/constants/supported-chains';

import { RPC_URLS } from 'common-util/Contracts';

export const neon = {
  id: 245_022_934,
  name: 'Neon',
  network: 'neon',
  nativeCurrency: {
    decimals: 18,
    name: 'Neon',
    symbol: 'NEON',
  },
  rpcUrls: {
    public: { http: ['https://neon-mainnet.everstake.one'] },
    default: { http: ['https://neon-proxy-mainnet.solana.p2p.org'] },
  },
  blockExplorers: {
    etherscan: { name: 'NeonScan', url: 'https://neonscan.org/' },
    default: { name: 'NeonScan', url: 'https://neonscan.org/' },
  },
  contracts: {
    multicall3: {
      // replace
      address: '0xca11bde05977b3631167028862be2a173976ca11',
      blockCreated: 11_907_934,
    },
  },
};

export const projectId = process.env.NEXT_PUBLIC_WALLET_PROJECT_ID;

const { publicClient, webSocketPublicClient, chains } = configureChains(
  SUPPORTED_CHAINS,
  [
    publicProvider({
      rpc: (chain) => ({
        http: RPC_URLS[chain.id],
      }),
    }),
    w3mProvider({ projectId }),
  ],
);

export const wagmiConfig = createConfig({
  autoConnect: true,
  logger: { warn: null },
  chains,
  connectors: [
    ...w3mConnectors({
      projectId,
      version: 2, // v2 of wallet connect
      chains,
    }),
    new SafeConnector({
      chains,
      options: {
        allowedDomains: [/gnosis-safe.io$/, /app.safe.global$/],
        debug: false,
      },
    }),
  ],
  publicClient,
  webSocketPublicClient,
});

export const ethereumClient = new EthereumClient(wagmiConfig, chains);
