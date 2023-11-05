import { NewRequest } from 'components/NewRequest';
import React, { useEffect, useState } from 'react';
import { Row, Col } from 'antd';
import VideoCard from 'components/VideoCards/VideoCard';
import { getAgentURL } from 'common-util/Contracts';

const LandingPage = () => {
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

  const renderVideoCards = () => {
    if (!videos || videos.length === 0) {
      // Fallback content when there are no videos
      return <p>No videos to display</p>;
    }

    return videos.map((video, index) => (
      <Col key={index} xs={24} sm={12} md={6} lg={12} xl={12}>
        <VideoCard videoHash={video.video} imageHash={video.image} prompt={video.prompt} />
      </Col>
    ));
  };

  return (
    <div style={{
      display: 'flex', flexDirection: 'column', alignItems: 'center', maxWidth: '1140px', margin: '0 auto',
    }}
    >
      <NewRequest />
      <Row style={{ height: '50px' }} />
      <Row gutter={[16, 16]}>
        {renderVideoCards()}
      </Row>
    </div>
  );
};

export default LandingPage;
