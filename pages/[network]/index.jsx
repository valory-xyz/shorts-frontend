import { HomePage } from 'components/Home';
import {
  SUPPORTED_CHAIN_ID_BY_CHAIN_SLUG,
  SUPPORTED_CHAIN_SLUGS,
} from 'common-util/constants/supported-chains';

export const getStaticPaths = () => {
  return {
    paths: SUPPORTED_CHAIN_SLUGS.map((network) => ({
      params: { network },
    })),
    fallback: 'blocking',
  };
};

export const getStaticProps = async ({ params }) => {
  const { network } = params;
  return {
    props: {
      chainId: SUPPORTED_CHAIN_ID_BY_CHAIN_SLUG[network],
    },
  };
};

const NetworkHomepage = (props) => <HomePage {...props} />;

export default NetworkHomepage;
