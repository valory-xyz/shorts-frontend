import { useSelector } from 'react-redux';
import { getIsValidChainId } from '../functions';

export const useHelpers = () => {
  const account = useSelector((state) => state?.setup?.account);
  const chainId = useSelector((state) => state?.setup?.chainId);
  const queueTime = useSelector((state) => state.setup.queueTime);

  return {
    chainId,
    account,
    isValidChainId: getIsValidChainId(chainId),
    queueTime,
  };
};
