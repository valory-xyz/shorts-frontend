import { useCallback, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useRouter } from 'next/router';
import { toLower } from 'lodash';

import { setChainId } from 'store/setup/actions';
import { PAGES_TO_LOAD_WITHOUT_CHAINID } from 'util/constants';
import {
  DEFAULT_CHAIN_ID,
  DEFAULT_CHAIN_NETWORK,
  SUPPORTED_CHAINS,
} from '../constants/supported-chains';

const isValidNetworkName = (name) => {
  const isValid = SUPPORTED_CHAINS.some(
    (e) => toLower(e.network) === toLower(name),
  );
  return isValid;
};

const getChainIdFromPath = (networkName) =>
  SUPPORTED_CHAINS.find((e) => toLower(e.network) === toLower(networkName))?.id;

/**
 * Hook to handle the routing
 */
export const useHandleRoute = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const path = router?.pathname || '';
  const networkNameFromUrl = router?.query?.network;

  const dispatchWithDelay = useCallback(
    (action) => {
      setTimeout(() => {
        dispatch(action);
      }, 0);
    },
    [dispatch],
  );

  const updateChainId = useCallback(
    (chainId) => {
      sessionStorage.setItem('chainId', chainId);
      dispatchWithDelay(setChainId(chainId));
    },
    [dispatchWithDelay],
  );

  // updating the blockchain information in redux
  useEffect(() => {
    const isValidNetwork = isValidNetworkName(networkNameFromUrl);

    const chainIdFromPath = getChainIdFromPath(networkNameFromUrl);
    updateChainId(isValidNetwork ? chainIdFromPath : DEFAULT_CHAIN_ID);
  }, [networkNameFromUrl, dispatchWithDelay, updateChainId]);

  useEffect(() => {
    if (PAGES_TO_LOAD_WITHOUT_CHAINID.includes(path)) {
      return;
    }

    /**
     * if user navigates to `/` (homepage) then
     * redirect to `/gnosis` page
     */
    if (path === '/') {
      router.push(`/${DEFAULT_CHAIN_NETWORK}`);
      return;
    }

    /**
     * if the network name is invalid, eg.
     * - user navigates to `/random-page` => redirect to `/gnosis`
     * -
     */
    if (!isValidNetworkName(networkNameFromUrl)) {
      router.push(`/${DEFAULT_CHAIN_NETWORK}`);
    }
  }, [path, networkNameFromUrl, router]);

  const onHomeClick = () => {
    if (networkNameFromUrl) {
      router.push(`/${networkNameFromUrl}`);
    } else {
      router.push(`/${DEFAULT_CHAIN_NETWORK}`);
    }
  };

  return { onHomeClick, updateChainId };
};
