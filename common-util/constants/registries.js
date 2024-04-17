import {
  AGENT_REGISTRY_ADDRESS_BASE,
  AGENT_REGISTRY_ADDRESS_GNOSIS,
} from 'common-util/AbiAndAddresses';
import { gnosis, base } from 'wagmi/chains';

export const REGISTRIES = {
  [gnosis.id]: AGENT_REGISTRY_ADDRESS_GNOSIS,
  [base.id]: AGENT_REGISTRY_ADDRESS_BASE,
};
