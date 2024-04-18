import { HomePage } from 'components/Home';
import { SUPPORTED_CHAIN_ID_BY_CHAIN_SLUG } from 'common-util/constants/supported-chains';
import { useRouter } from 'next/router';

const NetworkHomepage = () => {
  const router = useRouter();
  const { network } = router.query;
  const chainId = SUPPORTED_CHAIN_ID_BY_CHAIN_SLUG[`${network}`];

  if (!network || !chainId) {
    return null;
  }

  return <HomePage network={network} chainId={chainId} />;
};

export default NetworkHomepage;
