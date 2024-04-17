import { HomePage } from 'components/Home';
import { SUPPORTED_CHAIN_ID_BY_CHAIN_SLUG } from 'common-util/constants/supported-chains';

const validateNetworkQuery = (network) => {
  if (!network) return true;
  return SUPPORTED_CHAIN_ID_BY_CHAIN_SLUG[network] !== undefined;
};

export const getServerSideProps = async ({ query }) => {
  const { network } = query;
  if (!validateNetworkQuery(network)) {
    return {
      redirect: {
        destination: '/',
        permanent: false,
      },
    };
  }
  return {
    props: {
      chainId: SUPPORTED_CHAIN_ID_BY_CHAIN_SLUG[network],
    },
  };
};

const NetworkHomepage = (props) => <HomePage {...props} />;

export default NetworkHomepage;
