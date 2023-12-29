import {
  Footer as CommonFooter,
} from '@autonolas/frontend-library';

import { Typography } from 'antd';
import { FooterContainer } from './styles';

const Footer = () => (
  <FooterContainer>
    <CommonFooter className="custom-footer" />
    <Typography.Text type="secondary">
      Powered by
      {' '}
      <a href="https://olas.network" rel="noopener noreferrer" target="_blank">Olas</a>
    </Typography.Text>
  </FooterContainer>
);

export default Footer;
