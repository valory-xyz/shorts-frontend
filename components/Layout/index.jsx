import { useMemo } from 'react';
import { useRouter } from 'next/router';
import { Layout, Button, ConfigProvider, Select } from 'antd';
import PropTypes from 'prop-types';
import Image from 'next/image';
import styled from 'styled-components';
import { COLOR, MEDIA_QUERY } from '@autonolas/frontend-library';

import { PAGES_TO_LOAD_WITHOUT_CHAINID } from 'util/constants';
import { GREEN_THEME } from 'util/theme';
import {
  DEFAULT_CHAIN,
  SUPPORTED_CHAINS,
} from 'common-util/constants/supported-chains';
import { useHandleRoute } from 'common-util/hooks/useHandleRoute';
import { useHelpers } from 'common-util/hooks';
import Login from './Login';
import Footer from './Footer';
import { CustomLayout } from './styles';

const { Header, Content } = Layout;

const StyledHeader = styled(Header)`
  border-bottom: 1px solid ${COLOR.BORDER_GREY};
  padding: 20px !important;
  gap: 10px;
`;

const Banner = styled.div`
  background-color: ${COLOR.BLACK};
  color: ${COLOR.WHITE};
  padding: 15px;
  text-align: center;
  margin-top: 64px;
  margin-bottom: 24px;
  ${MEDIA_QUERY.tablet} {
    margin-top: 0;
  }
`;

const NavigationBar = ({ children }) => {
  const router = useRouter();
  const { chainName } = useHelpers();

  const { onHomeClick, updateChainId } = useHandleRoute();

  const path = router?.pathname || '';

  const defaultChain = useMemo(() => {
    if (router.query.network) {
      return router.query.network;
    }
    return DEFAULT_CHAIN.network;
  }, [router.query.network]);

  return (
    <CustomLayout>
      <StyledHeader>
        <div>
          <div
            className="column-1"
            style={{ cursor: 'pointer', outline: 'none' }}
            tabIndex={0}
            role="button"
            onClick={onHomeClick}
            onKeyPress={onHomeClick}
          >
            <Image src="/images/logo.png" alt="logo" width={280} height={61} />
          </div>
        </div>

        {router.isReady && (
          <Select
            placeholder="Select Network"
            key={defaultChain}
            defaultValue={defaultChain}
            showSearch
            options={SUPPORTED_CHAINS.map((e) => ({
              label: e.name,
              value: e.network,
            }))}
            onChange={(value) => {
              const currentChainInfo = SUPPORTED_CHAINS.find(
                (e) => e.network === value,
              );

              if (currentChainInfo) {
                // update session storage
                sessionStorage.setItem('chainId', currentChainInfo.id);

                if (PAGES_TO_LOAD_WITHOUT_CHAINID.find((e) => e === path)) {
                  // eg. /disclaimer will be redirect to same page ie. /disclaimer
                  updateChainId(currentChainInfo.id);
                  router.push(`/${path}`);
                } else {
                  // eg. /base will be redirect to
                  // /base/*
                  const replacedPath = router.asPath.replace(chainName, value);
                  window.open(replacedPath, '_self');
                }
              }
            }}
            filterOption={(input, option) => {
              const { label } = option;
              return label.toLowerCase().indexOf(input.toLowerCase()) >= 0;
            }}
            style={{ minWidth: 200 }}
          />
        )}

        <div className="column-2">
          {router.pathname.includes('requests') && (
            <ConfigProvider theme={GREEN_THEME}>
              <Button type="primary" onClick={() => router.push('/')}>
                New request
              </Button>
            </ConfigProvider>
          )}

          <Login />
        </div>
      </StyledHeader>
      <Banner>This product is in Research Beta</Banner>

      <Content className="site-layout">
        {router.isReady && (
          <div className="site-layout-background">{children}</div>
        )}
      </Content>

      <Footer />
    </CustomLayout>
  );
};

NavigationBar.propTypes = {
  children: PropTypes.element,
};

NavigationBar.defaultProps = {
  children: null,
};

export default NavigationBar;
