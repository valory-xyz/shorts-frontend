import { Footer as CommonFooter } from '@autonolas/frontend-library';
import Link from 'next/link';

import { Typography } from 'antd';
import { FooterContainer } from './styles';

const FooterContent = () => <Typography.Text>{`© Valory ${new Date().getFullYear()}`} </Typography.Text>;

const Footer = () => (
  <FooterContainer>
    <CommonFooter className='custom-footer' centerContent={<FooterContent />} />
  </FooterContainer>
);

export default Footer;
