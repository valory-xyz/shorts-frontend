import { Row, Col, Divider } from 'antd';
import styled from 'styled-components';

import { NewRequest } from '../NewRequest';
import { VideoList } from './VideoList';

const Container = styled.div`
  width: 100%;
`;

export const HomePage = () => (
  <Container>
    <Row>
      <Col xs={24} md={10} style={{ position: 'relative', width: '100%' }}>
        <div style={{ position: 'fixed' }}>
          <NewRequest />
        </div>
      </Col>

      <Col xs={0} md={1}>
        <Divider type="vertical" />
      </Col>

      <Col xs={24} md={13}>
        <Divider type="vertical" />
        <VideoList />
      </Col>
    </Row>
  </Container>
);
