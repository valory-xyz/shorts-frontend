import { Alert } from 'antd';
import styled from 'styled-components';

const Container = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  gap: 2rem;
`;

const AlertContainer = styled.div`
  width: 100%;
  height: calc(-250px + 100vh);
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: default;
`;

export const HomePage = () => {
  return (
    <Container>
      <AlertContainer>
        <Alert message='This app has been deprecated and is no longer supported.' showIcon />
      </AlertContainer>
    </Container>
  );
};
