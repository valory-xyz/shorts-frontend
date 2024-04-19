import InfiniteScroll from 'react-infinite-scroll-component';
import { Col, Divider, Empty, Row, Skeleton } from 'antd';
import styled from 'styled-components';

import { useHelpers } from 'common-util/hooks';
import { useVideoList } from '../../hooks/useVideoList';
import { VideoCard } from './VideoCard';

const VideoContainer = styled.div`
  width: 100%;
`;

const InfiniteScrollLoader = () => (
  <Row gutter={[48, 16]}>
    {[1, 2, 3].map((count) => (
      <Col
        key={count}
        xs={24}
        sm={12}
        md={12}
        lg={12}
        xl={12}
        style={{ padding: '0 96px' }}
      >
        <Skeleton active />
      </Col>
    ))}
  </Row>
);

export const VideoList = () => {
  const { chainId } = useHelpers();

  const { videos, loading, hasMoreVideos, increasePageCount } =
    useVideoList(chainId);

  if (videos?.length === 0 && !loading) {
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
        next={increasePageCount}
        hasMore={hasMoreVideos}
        loader={<InfiniteScrollLoader />}
        endMessage={
          <Divider plain className="mt-48">
            No more shorts to show
          </Divider>
        }
      >
        <Row gutter={[48, 16]}>
          {videos.map((video) => (
            <Col
              key={video.id}
              xs={24}
              sm={12}
              md={12}
              lg={12}
              xl={12}
              style={{ padding: '0 96px' }}
            >
              {loading ? <Skeleton active /> : <VideoCard video={video} />}
            </Col>
          ))}
        </Row>
      </InfiniteScroll>
    </VideoContainer>
  );
};
