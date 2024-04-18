import { useState, useEffect } from 'react';
import { getAgentHash, getIpfsResponse } from 'common-util/functions';
import { useContractRead } from 'wagmi';
import { AGENT_REGISTRY_ABI } from 'common-util/AbiAndAddresses';
import { REGISTRIES } from 'common-util/constants/registries';
import { DEFAULT_CHAIN } from 'common-util/constants/supported-chains';
import { RequestForm } from './RequestForm';

export const NewRequest = ({ chainId }) => {
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
