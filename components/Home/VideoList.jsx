import { useEffect, useState } from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';
import { Col, Divider, Empty, Row, Skeleton } from 'antd';
import styled from 'styled-components';
import { uniqBy } from 'lodash';
import { usePublicClient } from 'wagmi';

import { getAgentURL } from 'common-util/Contracts';
import { SUPPORTED_CHAIN_ID_BY_CHAIN_SLUG } from 'common-util/constants/supported-chains';
import { useRouter } from 'next/router';
import { VideoCard } from './VideoCard';

const VideoContainer = styled.div`
  width: 100%;
`;

export const VideoList = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [initialLoadComplete, setInitialLoadComplete] = useState(false);
  const [videos, setVideos] = useState([]);
  const [hasMoreVideos, setHasMoreVideos] = useState(true);
  const [pageCount, setPageCount] = useState(1);

  const { chain } = usePublicClient({
    chainId: SUPPORTED_CHAIN_ID_BY_CHAIN_SLUG[router?.query?.network],
  });

  const increasePageCount = () => {
    setPageCount((prev) => prev + 1);
  };

  const fetchVideos = async () => {
    if (loading || !hasMoreVideos) {
      return;
    }

    if (!initialLoadComplete) {
      setLoading(true);
    }

    try {
      const agentURL = getAgentURL();
      const agentResponsesURL = `${agentURL}/responses?pageNum=${pageCount}&limit=5`;
      const response = await fetch(agentResponsesURL);
      const data = await response.json();
      const moreList =
        chain?.id === undefined
          ? data.data
          : data.data.filter((video) => video.chainId === chain.id);

      // If no videos for the selected chain in the current portion,
      // continue fetching the next portion until videos are found
      if (pageCount < data.numPages && moreList.length === 0) {
        increasePageCount();
        return;
      }

      setVideos((prev) => uniqBy([...prev, ...moreList], 'id'));
      setHasMoreVideos(pageCount < data.numPages);
    } catch (error) {
      console.error('Failed to fetch videos:', error);
    } finally {
      setLoading(false);
      setInitialLoadComplete(true);
    }
  };

  useEffect(() => {
    fetchVideos();
  }, [pageCount]);

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
        loader={<Skeleton active />}
        endMessage={
          <Divider plain className="mt-48">
            No more shorts to show
          </Divider>
        }
      >
        <Row gutter={[48, 16]}>
          {videos.map((video) => (
            <Col xs={24} sm={12} md={12} lg={12} xl={12} key={video.id}>
              {loading ? <Skeleton active /> : <VideoCard video={video} />}
            </Col>
          ))}
        </Row>
      </InfiniteScroll>
    </VideoContainer>
  );
};
