import { useState, useCallback, useEffect } from 'react';
import { uniqBy } from 'lodash';

import { getAgentURL } from 'common-util/Contracts';

export const useVideoList = (chainId) => {
  const [loading, setLoading] = useState(true);
  const [initialLoadComplete, setInitialLoadComplete] = useState(false);
  const [videos, setVideos] = useState([]);
  const [hasMoreVideos, setHasMoreVideos] = useState(true);
  const [pageCount, setPageCount] = useState(1);

  const increasePageCount = () => {
    setPageCount((prev) => prev + 1);
  };

  const fetchVideos = useCallback(async () => {
    if (!hasMoreVideos) {
      setLoading(false);
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
        chainId === undefined
          ? data.data // show all the data
          : data.data.filter((video) => video.chainId === chainId); // show chain specific data

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
  }, [chainId, hasMoreVideos, initialLoadComplete, pageCount]);

  useEffect(() => {
    fetchVideos();
  }, [pageCount, fetchVideos]);

  return {
    loading,
    videos,
    hasMoreVideos,
    increasePageCount,
  };
};
