import React, { useEffect, useState } from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';
import {
  Avatar, Divider, List, Skeleton,
} from 'antd';
import styled from 'styled-components';

const VideoContainer = styled.div`
  width: 100%;
`;

export const VideoList = () => {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);
  const [hasMoreVideos, setHasMoreVideos] = useState(true);
  const [pageCount, setPageCount] = useState(0);

  const loadMoreVideos = () => {
    if (loading) {
      return;
    }

    const currentPageCount = pageCount + 1;
    setLoading(true);
    fetch(
      `https://randomuser.me/api/?results=10&inc=name,gender,email,nat,picture&noinfo&page=${currentPageCount}`,
    )
      .then((res) => res.json())
      .then((body) => {
        const moreList = body.results;
        setData([...data, ...moreList]);
        setHasMoreVideos(moreList.length > 0);
        setLoading(false);
        setPageCount(pageCount + 1);
      })
      .catch((e) => {
        console.error(e);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  // on initial load
  useEffect(() => {
    loadMoreVideos();
  }, []);

  console.log({ hasMoreVideos, data });

  return (
    <VideoContainer>
      <InfiniteScroll
        dataLength={data.length}
        next={loadMoreVideos}
        hasMore={hasMoreVideos}
        loader={<Skeleton avatar paragraph={{ rows: 2 }} active />}
        endMessage={<Divider plain>It is all, nothing more!</Divider>}
      >
        <List
          dataSource={data}
          renderItem={(item) => (
            <List.Item key={item.email}>
              <List.Item.Meta
                avatar={<Avatar src={item.picture.large} />}
                title={<a href="https://ant.design">{item.name.last}</a>}
                description={item.email}
              />
              <div>Content</div>
            </List.Item>
          )}
        />
      </InfiniteScroll>
    </VideoContainer>
  );
};
