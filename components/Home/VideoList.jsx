import { useEffect, useState } from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';
import {
  Col, Divider, Empty, Row, Skeleton,
} from 'antd';
import styled from 'styled-components';
import { uniqBy } from 'lodash';

import { getAgentURL } from 'common-util/Contracts';
import { VideoCard } from './VideoCard';

const VideoContainer = styled.div`
  width: 100%;
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
      const agentResponsesURL = `${agentURL}/responses?pageNum=${currentPageCount}&limit=5`;
      const response = await fetch(agentResponsesURL);
      const data = await response.json();
      const moreList = data.data;
      setVideos((prev) => uniqBy([...prev, ...moreList], 'id'));
      setHasMoreVideos(currentPageCount <= data.numPages);
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
            description="No shorts to display"
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
        loader={(
          <Skeleton
            avatar
            paragraph={{ rows: 2 }}
            active
            style={{ marginTop: '1rem' }}
          />
        )}
        endMessage={(
          <Divider plain className="mt-48">
            No more videos to show
          </Divider>
        )}
      >
        <Row gutter={[48, 16]}>
          {videos.map((video) => (
            <Col xs={24} sm={12} md={12} lg={12} xl={12} key={video.id}>
              <VideoCard video={video} />
            </Col>
          ))}
        </Row>
      </InfiniteScroll>
    </VideoContainer>
  );
};
