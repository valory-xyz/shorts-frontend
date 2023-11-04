import { NewRequest } from 'components/NewRequest';
import React, { useEffect, useState } from 'react';
import { Row, Col } from 'antd';
import VideoCard from 'components/VideoCards/VideoCard';

export const getServerSideProps = async () => {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_AGENT_URL}/responses`);
    const data = await response.json();

    return {
      props: {
        initialVideos: data.data,
      },
    };
  } catch (error) {
    console.error('Failed to fetch videos:', error);
    return {
      props: {
        initialVideos: [],
      },
    };
  }
};

const LandingPage = ({ initialVideos }) => {
  const [videos, setVideos] = useState(initialVideos);

  useEffect(() => {
    const fetchVideos = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_AGENT_URL}/responses`);
        const data = await response.json();
        setVideos(data.data);
      } catch (error) {
        console.error('Failed to fetch videos:', error);
      }
    };

    fetchVideos();
  }, []);

  return (
    <>
      <NewRequest />
      <Row></Row>
      <Row gutter={[16, 16]}>
        {videos.map((video, index) => (
          <Col key={index} xs={24} sm={12} md={6} lg={6} xl={6}>
            <VideoCard videoHash={video.video} imageHash={video.image} prompt={video.prompt} />
          </Col>
        ))}
      </Row>
    </>
  );
};

export default LandingPage;