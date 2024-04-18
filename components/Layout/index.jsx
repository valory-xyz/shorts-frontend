import { useRouter } from 'next/router';
import { Layout, Button, ConfigProvider, Select } from 'antd';
import PropTypes from 'prop-types';
import Image from 'next/image';

import { GREEN_THEME } from 'util/theme';
import styled from 'styled-components';
import { COLOR, MEDIA_QUERY } from '@autonolas/frontend-library';
import Link from 'next/link';
import { SUPPORTED_CHAINS } from 'common-util/constants/supported-chains';
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

  const handleSelect = (value) => {
    router.push(`/${value}`);
  };

  return (
    <CustomLayout>
      <StyledHeader>
        <Link href="/">
          <div className="column-1">
            <Image src="/images/logo.png" alt="logo" width={280} height={61} />
          </div>
        </Link>

        {router.isReady && (
          <Select
            key={router.query.network}
            style={{ width: 200 }}
            placeholder="Select Network"
            defaultValue={router.query.network}
            onChange={handleSelect}
          >
            {SUPPORTED_CHAINS.map((chain) => (
              <Select.Option key={chain.network} value={chain.network}>
                {chain.name}
              </Select.Option>
            ))}
          </Select>
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
        <div className="site-layout-background">{children}</div>
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
