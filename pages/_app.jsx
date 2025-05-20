import { useState, useEffect } from 'react';
import Head from 'next/head';
import { ConfigProvider } from 'antd';
import PropTypes from 'prop-types';

/** antd theme config */
import Layout from 'components/Layout';
import GlobalStyle from 'components/GlobalStyles';
import { THEME_CONFIG } from '@autonolas/frontend-library';

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
        <meta name='title' content='Shorts.WTF' />
      </Head>
      {isMounted && (
        <ConfigProvider theme={THEME_CONFIG}>
          <Layout>
            <Component {...pageProps} />
          </Layout>
        </ConfigProvider>
      )}
    </>
  );
};

MyApp.getInitialProps = async ({ Component, ctx }) => {
  const pageProps = Component.getInitialProps ? await Component.getInitialProps(ctx) : {};

  return { pageProps };
};

MyApp.propTypes = {
  Component: PropTypes.oneOfType([PropTypes.func, PropTypes.shape({})]).isRequired,
  pageProps: PropTypes.shape({}).isRequired,
};

MyApp.propTypes = {
  Component: PropTypes.oneOfType([PropTypes.func, PropTypes.shape({})]).isRequired,
  pageProps: PropTypes.shape({}).isRequired,
};

export default MyApp;
