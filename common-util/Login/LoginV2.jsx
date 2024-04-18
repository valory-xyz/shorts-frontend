import { useEffect } from 'react';
import PropTypes from 'prop-types';
import { Web3Modal, Web3Button, Web3NetworkSwitch } from '@web3modal/react';
import { useAccount, useBalance, usePublicClient } from 'wagmi';
import { COLOR } from '@autonolas/frontend-library';
import { useDispatch } from 'react-redux';
import { useRouter } from 'next/router';

import styled from 'styled-components';
import { setChainId } from 'store/setup/actions';
import {
  getChainId,
  getChainIdOrDefaultToMainnet,
} from 'common-util/functions';
import { useScreen } from 'common-util/hooks';
import { SUPPORTED_CHAIN_ID_BY_CHAIN_SLUG } from 'common-util/constants/supported-chains';
import { projectId, ethereumClient } from './config';

const LoginContainer = styled.div`
  display: flex;
  align-items: center;
  font-size: 18px;
  line-height: normal;
`;

export const LoginV2 = ({
  onConnect: onConnectCb,
  onDisconnect: onDisconnectCb,
  theme = 'light',
}) => {
  const router = useRouter();
  const dispatch = useDispatch();
  const { address } = useAccount();
  const { chain } = usePublicClient({
    chainId: SUPPORTED_CHAIN_ID_BY_CHAIN_SLUG[`${router.query.network}`],
  });
  const { data } = useBalance({ address });
  const { isMobile } = useScreen();

  useEffect(() => {
    // if chainId is undefined, the wallet is not connected & default to mainnet
    if (chain.id === undefined) {
      /**
       * wait for 100ms to get the chainId & set it to redux to avoid race condition
       * and dependent components are loaded once the chainId is set
       */
      setTimeout(() => {
        const tempChainId = getChainId();
        dispatch(setChainId(tempChainId));
      }, 100);
    } else {
      const tempChainId = getChainIdOrDefaultToMainnet(chain.id);
      dispatch(setChainId(tempChainId));
    }
  }, [chain.id]);

  const { connector } = useAccount({
    onConnect: ({ address: currentAddress }) => {
      if (onConnectCb) {
        onConnectCb({
          address: address || currentAddress,
          balance: data?.formatted,
          chainId: chain.id,
        });
      }
    },
    onDisconnect() {
      if (onDisconnectCb) onDisconnectCb();
    },
  });

  useEffect(() => {
    const getData = async () => {
      try {
        // This is the initial `provider` that is returned when
        // using web3Modal to connect. Can be MetaMask or WalletConnect.
        const modalProvider =
          connector?.options?.getProvider?.() ||
          (await connector?.getProvider?.());

        if (modalProvider) {
          // *******************************************************
          // ************ setting to the window object! ************
          // *******************************************************
          window.MODAL_PROVIDER = modalProvider;

          if (modalProvider?.on) {
            // https://docs.ethers.io/v5/concepts/best-practices/#best-practices--network-changes
            const handleChainChanged = () => {
              window.location.reload();
            };

            modalProvider.on('chainChanged', handleChainChanged);

            // cleanup
            return () => {
              if (modalProvider.removeListener) {
                modalProvider.removeListener(
                  'chainChanged',
                  handleChainChanged,
                );
              }
            };
          }
        }

        return () => null;
      } catch (error) {
        console.error(error);
        return () => null;
      }
    };

    getData();
  }, [connector]);

  return (
    <LoginContainer>
      <Web3NetworkSwitch />
      &nbsp;&nbsp;
      <Web3Button
        balance="show"
        avatar="hide"
        icon={isMobile ? 'hide' : 'show'}
      />
      <Web3Modal
        projectId={projectId}
        ethereumClient={ethereumClient}
        themeMode={theme}
        themeVariables={{
          '--w3m-button-border-radius': '5px',
          '--w3m-accent-color': COLOR.PRIMARY,
          '--w3m-background-color': COLOR.PRIMARY,
        }}
      />
    </LoginContainer>
  );
};

LoginV2.propTypes = {
  onConnect: PropTypes.func,
  onDisconnect: PropTypes.func,
  theme: PropTypes.string,
};

LoginV2.defaultProps = {
  onConnect: undefined,
  onDisconnect: undefined,
  theme: 'light',
};
