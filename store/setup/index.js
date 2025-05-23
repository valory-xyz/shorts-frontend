import { SUPPORTED_CHAINS } from 'common-util/constants/supported-chains';
import { apiTypes, syncTypes } from './_types';

/**
 * initialState of the store
 */
const initialState = {
  account: null,
  balance: null,
  chainId: null,
  errorMessage: null,
  queueTime: null,
};

const setup = (state = initialState, { data, type } = {}) => {
  switch (type) {
    case apiTypes.GET_API: {
      return { ...state, data };
    }

    case syncTypes.SET_ACCOUNT:
    case syncTypes.SET_BALANCE:
    case syncTypes.SET_LOGIN_ERROR:
    case syncTypes.SET_CHAIN_ID: {
      const networkInfo = SUPPORTED_CHAINS.find(
        (item) => item.id === data.chainId,
      );
      return {
        ...state,
        ...data,
        chainName: networkInfo?.network || null,
      };
    }
    case syncTypes.SET_QUEUE_TIME:
    case syncTypes.SET_STORE_STATE: {
      return { ...state, ...data };
    }

    case syncTypes.SET_LOGOUT: {
      return { ...initialState };
    }
    default:
      return state;
  }
};

export default setup;
