import { useRouter } from 'next/router';
import dynamic from 'next/dynamic';
import {
  Layout, Button, ConfigProvider, Menu,
} from 'antd';
import PropTypes from 'prop-types';

import { GREEN_THEME } from 'util/theme';
import { useState } from 'react';
import Login from '../Login';
import Footer from './Footer';
import { CustomLayout, Logo } from './styles';

const LogoSvg = dynamic(() => import('common-util/SVGs/logo'));

const { Header, Content } = Layout;

const NavigationBar = ({ children }) => {
  const router = useRouter();
  const [selectedMenu, setSelectedMenu] = useState([]);

  const handleMenuItemClick = ({ key }) => {
    router.push(`/${key}`);
    setSelectedMenu(key);
  };

  return (
    <CustomLayout pathname={router.pathname}>
      <Header style={{ justifyContent: 'space-between' }}>
        <div className="column-1">
          <Logo data-testid="member-logo" onClick={() => router.push('/')}>
            <LogoSvg />
          </Logo>
          <Menu
            theme="light"
            mode="horizontal"
            selectedKeys={[selectedMenu]}
            onClick={handleMenuItemClick}
            items={[{ key: 'devs', label: 'Devs' }]}
          />
        </div>

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
      </Header>

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
