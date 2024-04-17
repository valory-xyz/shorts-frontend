import { useState, useEffect } from 'react';
import { getAgentHash, getIpfsResponse } from 'common-util/functions';
import { useContractRead, usePublicClient } from 'wagmi';
import { AGENT_REGISTRY_ABI } from 'common-util/AbiAndAddresses';
import { REGISTRIES } from 'common-util/constants/registries';
import {
  DEFAULT_CHAIN,
  SUPPORTED_CHAIN_ID_BY_CHAIN_SLUG,
} from 'common-util/constants/supported-chains';
import { useRouter } from 'next/router';
import { RequestForm } from './RequestForm';

export const NewRequest = () => {
  const router = useRouter();
  const [dataList, setDataList] = useState([]);
  const { chain } = usePublicClient({
    chainId: SUPPORTED_CHAIN_ID_BY_CHAIN_SLUG[`${router.query.network}`],
  });

  const { data: agentHashes, isLoading } = useContractRead({
    abi: AGENT_REGISTRY_ABI,
    address: REGISTRIES[chain?.id ?? DEFAULT_CHAIN.id],
    functionName: 'getHashes',
    args: [],
  });

  useEffect(() => {
    const getIpfsDetailsFromId = async () => {
      const currentHash = getAgentHash(agentHashes[1]);

      const data = await getIpfsResponse(currentHash);
      setDataList(data.tools || []);
    };

    if (agentHashes) {
      getIpfsDetailsFromId();
    }
  }, [agentHashes]);

  return <RequestForm isToolsLoading={isLoading} tools={dataList} />;
};
