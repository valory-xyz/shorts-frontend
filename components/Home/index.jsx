import { Row, Col } from 'antd';
import styled from 'styled-components';

import { NewRequest } from '../NewRequest';
import { VideoList } from './VideoList';

const Container = styled.div`
  width: 100%;
`;

export const HomePage = () => (
  <Container>
    <Row gutter={24}>
      <Col xs={24} lg={10}>
        <NewRequest />
      </Col>

      <Col xs={24} lg={14}>
        <VideoList />
      </Col>
    </Row>
  </Container>
);
