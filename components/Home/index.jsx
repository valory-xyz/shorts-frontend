import styled from 'styled-components';
import { NewRequest } from '../NewRequest';
import { VideoList } from './VideoList';

const Container = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  gap: 2rem;
`;

export const HomePage = () => {
  return (
    <Container>
      <NewRequest />
      <p>hi</p>
      <VideoList />
    </Container>
  );
};
