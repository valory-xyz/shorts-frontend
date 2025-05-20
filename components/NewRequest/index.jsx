import { useState, useEffect } from 'react';
import { useContractRead } from 'wagmi';

import { getAgentHash, getIpfsResponse } from 'common-util/functions';
import { AGENT_REGISTRY_ABI } from 'common-util/AbiAndAddresses';
import { REGISTRIES } from 'common-util/constants/registries';
import { DEFAULT_CHAIN } from 'common-util/constants/supported-chains';
import { useHelpers } from 'common-util/hooks';
import { RequestForm } from './RequestForm';

export const NewRequest = () => {
  const { chainId } = useHelpers();
  const [dataList, setDataList] = useState([]);

  const { data: agentHashes, isLoading } = useContractRead({
    abi: AGENT_REGISTRY_ABI,
    address: REGISTRIES[chainId ?? DEFAULT_CHAIN.id],
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
