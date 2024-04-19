import { useState, useEffect } from 'react';
import Head from 'next/head';
import { createWrapper } from 'next-redux-wrapper';
import { ConfigProvider } from 'antd';
import PropTypes from 'prop-types';

/** wagmi config */
import { WagmiConfig as WagmiConfigProvider } from 'wagmi';
import { wagmiConfig } from 'common-util/Login/config';

/** antd theme config */
import Layout from 'components/Layout';
import GlobalStyle from 'components/GlobalStyles';
import { THEME_CONFIG } from '@autonolas/frontend-library';
import initStore from '../store';

const MyApp = ({ Component, pageProps }) => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  return (
    <>
      <GlobalStyle />
      <Head>
        <title>Shorts.WTF</title>
        <meta name="title" content="Shorts.WTF" />
      </Head>
      {isMounted && (
        <ConfigProvider theme={THEME_CONFIG}>
          <WagmiConfigProvider config={wagmiConfig}>
            <Layout>
              <Component {...pageProps} />
            </Layout>
          </WagmiConfigProvider>
        </ConfigProvider>
      )}
    </>
  );
};

MyApp.getInitialProps = async ({ Component, ctx }) => {
  const pageProps = Component.getInitialProps
    ? await Component.getInitialProps(ctx)
    : {};

  return { pageProps };
};

MyApp.propTypes = {
  Component: PropTypes.oneOfType([PropTypes.func, PropTypes.shape({})])
    .isRequired,
  pageProps: PropTypes.shape({}).isRequired,
};

MyApp.propTypes = {
  Component: PropTypes.oneOfType([PropTypes.func, PropTypes.shape({})])
    .isRequired,
  pageProps: PropTypes.shape({}).isRequired,
};

const wrapper = createWrapper(initStore);
export default wrapper.withRedux(MyApp);
