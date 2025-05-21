import { useRouter } from 'next/router';
import { Layout, Button, ConfigProvider } from 'antd';
import PropTypes from 'prop-types';
import Image from 'next/image';
import styled from 'styled-components';
import { COLOR } from '@autonolas/frontend-library';

import { GREEN_THEME } from 'util/theme';
import Link from 'next/link';
import Footer from './Footer';
import { CustomLayout } from './styles';

const { Header, Content } = Layout;

const StyledHeader = styled(Header)`
  border-bottom: 1px solid ${COLOR.BORDER_GREY};
  padding: 20px !important;
  gap: 10px;
`;

const NavigationBar = ({ children }) => {
  const router = useRouter();

  return (
    <CustomLayout>
      <StyledHeader>
        <div>
          <Link
            href="/"
            className="column-1"
            style={{ cursor: 'pointer', outline: 'none' }}
            tabIndex={0}
          >
            <Image src="/images/logo.png" alt="logo" width={280} height={61} />
          </Link>
        </div>

        <div className="column-2">
          {router.pathname.includes('requests') && (
            <ConfigProvider theme={GREEN_THEME}>
              <Button type="primary" onClick={() => router.push('/')}>
                New request
              </Button>
            </ConfigProvider>
          )}

          <Button type="primary" asChild>
            <a href="https://olas.network/">Learn more about Olas</a>
          </Button>
        </div>
      </StyledHeader>

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
