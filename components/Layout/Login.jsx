import { useEffect } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { useAccount, useBalance, usePublicClient } from 'wagmi';
import {
  setUserAccount as setUserAccountFn,
  setUserBalance as setUserBalanceFn,
  setChainId as setChainIdFn,
  setErrorMessage as setErrorMessageFn,
  setLogout as setLogoutFn,
} from 'store/setup/actions';
import { LoginV2 as LoginComponent } from 'common-util/Login';

import { SUPPORTED_CHAIN_ID_BY_CHAIN_SLUG } from 'common-util/constants/supported-chains';
import { useRouter } from 'next/router';

const Login = ({
  setUserAccount,
  setUserBalance,
  setChainId,
  setErrorMessage,
  setLogout,
}) => {
  const router = useRouter();
  const { address } = useAccount();
  const { chain } = usePublicClient({
    chainId: SUPPORTED_CHAIN_ID_BY_CHAIN_SLUG[`${router.query.network}`],
  });
  const chainId = chain?.id;
  const { data } = useBalance({ address, chainId: chain?.id });

  useEffect(() => {
    if (address) {
      setUserAccount(address);
      setUserBalance(data?.formatted);
      setChainId(chainId);
    } else {
      setLogout();
    }
  }, [address]);

  const onConnect = (response) => {
    setUserAccount(response.address);
    setUserBalance(response.balance);
    setChainId(response.chainId);
  };

  const onDisconnect = () => {
    setLogout();
  };

  const onError = (error) => {
    setErrorMessage(error);
  };

  return (
    <div>
      <LoginComponent
        onConnect={onConnect}
        onDisconnect={onDisconnect}
        onError={onError}
      />
    </div>
  );
};

Login.propTypes = {
  setUserAccount: PropTypes.func.isRequired,
  setUserBalance: PropTypes.func.isRequired,
  setChainId: PropTypes.func.isRequired,
  setErrorMessage: PropTypes.func.isRequired,
  setLogout: PropTypes.func.isRequired,
};

Login.defaultProps = {};

const mapDispatchToProps = {
  setUserAccount: setUserAccountFn,
  setUserBalance: setUserBalanceFn,
  setChainId: setChainIdFn,
  setErrorMessage: setErrorMessageFn,
  setLogout: setLogoutFn,
};

export default connect(null, mapDispatchToProps)(Login);
