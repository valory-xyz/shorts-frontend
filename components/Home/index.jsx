import React, { useEffect, useState } from 'react';
import { Row, Col } from 'antd';
import styled from 'styled-components';

import { getAgentURL } from 'common-util/Contracts';
import VideoCard from './VideoCard';
import { NewRequest } from '../NewRequest';
import { VideoList } from './VideoList';

const Container = styled.div`
  /* display: flex;
  flex-direction: column;
  align-items: center;
  max-width: 1140px;
  margin: 0 auto; */
`;

export const HomePage = () => {
  const [videos, setVideos] = useState([]);

  useEffect(() => {
    const fetchVideos = async () => {
      try {
        const agentURL = getAgentURL();
        const agentResponsesURL = `${agentURL}/responses`;
        const response = await fetch(agentResponsesURL);
        const data = await response.json();
        setVideos(data.data);
      } catch (error) {
        console.error('Failed to fetch videos:', error);
      }
    };

    fetchVideos();
  }, []);

  return (
    <Container>
      <Row>
        <Col xs={24} md={12} style={{ position: 'relative', width: '100%' }}>
          <div style={{ position: 'fixed' }}>
            <NewRequest />
          </div>
        </Col>

        <Col xs={24} md={12}>
          {videos?.length === 0 ? (
            <p>No videos to display</p>
          ) : (
            videos.map((video, index) => (
              <Col key={index} xs={24} sm={12} md={6} lg={12} xl={12}>
                <VideoCard
                  id={video.id}
                  videoHash={video.video}
                  imageHash={video.image}
                  prompt={video.prompt}
                />
              </Col>
            ))
          )}

          <VideoList />
        </Col>
      </Row>
    </Container>
  );
};
