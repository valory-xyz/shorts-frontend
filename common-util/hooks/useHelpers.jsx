import { useDispatch, useSelector } from 'react-redux';
import { getAgentURL } from 'common-util/Contracts';
import { setQueueTime } from 'store/setup/actions';
import { QUEUE_THRESHOLD } from 'util/constants';
import { getIsValidChainId, secondsToHms } from '../functions';

export const useHelpers = () => {
  const dispatch = useDispatch();

  const account = useSelector((state) => state?.setup?.account);
  const chainId = useSelector((state) => state?.setup?.chainId);
  const chainName = useSelector((state) => state?.setup?.chainName);
  const queueTimeInSeconds = useSelector((state) => state.setup.queueTime);

  const updateQueueTime = async () => {
    const agentURL = getAgentURL();
    const agentResponsesURL = `${agentURL}/queue_time`;
    const response = await fetch(agentResponsesURL);
    const data = await response.json();
    const remoteQueueTime = data.queue_time_in_seconds;
    dispatch(setQueueTime(remoteQueueTime));
  };

  const queueTimeInHms = secondsToHms(queueTimeInSeconds);
  const isQueueTimeAboveThreshold = queueTimeInSeconds > QUEUE_THRESHOLD;

  return {
    chainId,
    account,
    chainName,
    isValidChainId: getIsValidChainId(chainId),
    queueTimeInSeconds,
    queueTimeInHms,
    updateQueueTime,
    isQueueTimeAboveThreshold,
  };
};
