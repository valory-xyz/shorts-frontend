import React, { useEffect, useState } from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';
import {
  Col, Divider, Empty, Row, Skeleton,
} from 'antd';
import styled from 'styled-components';

import { getAgentURL } from 'common-util/Contracts';
import VideoCard from './VideoCard';

const VideoContainer = styled.div`
  width: 100%;
  margin: 20px;
  .infinite-scroll-component {
    padding: 0 12px;
  }
`;

export const VideoList = () => {
  const [loading, setLoading] = useState(false);
  const [videos, setVideos] = useState([]);
  const [hasMoreVideos, setHasMoreVideos] = useState(true);
  const [pageCount, setPageCount] = useState(0);

  const fetchVideos = async () => {
    if (loading) {
      return;
    }

    setLoading(true);

    const currentPageCount = pageCount + 1;
    try {
      const agentURL = getAgentURL();
      const agentResponsesURL = `${agentURL}/responses?pageNumber=${currentPageCount}&limit=5`;
      const response = await fetch(agentResponsesURL);
      const data = await response.json();
      const moreList = data.data;
      setVideos((prev) => [...prev, ...moreList]);
      setHasMoreVideos(moreList.length > 0);
      setPageCount(currentPageCount);
    } catch (error) {
      console.error('Failed to fetch videos:', error);
    } finally {
      setLoading(false);
    }
  };

  // on initial load
  useEffect(() => {
    fetchVideos();
  }, []);

  if (videos?.length === 0) {
    return (
      <VideoContainer>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            height: '500px',
          }}
        >
          <Empty
            image={Empty.PRESENTED_IMAGE_SIMPLE}
            description="No videos to display"
          />
        </div>
      </VideoContainer>
    );
  }

  return (
    <VideoContainer>
      <InfiniteScroll
        dataLength={videos.length}
        next={fetchVideos}
        hasMore={hasMoreVideos}
        loader={<Skeleton avatar paragraph={{ rows: 2 }} active />}
        endMessage={<Divider plain>It is all, nothing more!</Divider>}
      >
        <Row gutter={[16, 16]}>
          {videos.map((video, index) => (
            <Col xs={24} sm={12} md={6} lg={12} xl={12}>
              <VideoCard
                key={index}
                id={video.id}
                videoHash={video.video}
                imageHash={video.image}
                prompt={video.prompt}
              />
            </Col>
          ))}
        </Row>
      </InfiniteScroll>
    </VideoContainer>
  );
};
