import { useState, useCallback, useEffect } from 'react';
import { getAgentURL } from 'common-util/Contracts';
import { uniqBy } from 'lodash';

export const useVideoList = (chainId) => {
  const [loading, setLoading] = useState(false);
  const [initialLoadComplete, setInitialLoadComplete] = useState(false);
  const [videos, setVideos] = useState([]);
  const [hasMoreVideos, setHasMoreVideos] = useState(true);
  const [pageCount, setPageCount] = useState(1);

  const increasePageCount = () => {
    setPageCount((prev) => prev + 1);
  };

  const fetchVideos = useCallback(async () => {
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
        chainId === undefined
          ? data.data // show all the data
          : data.data.filter((video) => video.chainId === chainId); // show chain specfic data

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
  }, [chainId, hasMoreVideos, initialLoadComplete, loading, pageCount]);

  useEffect(() => {
    fetchVideos();
  }, [pageCount]);

  return {
    loading,
    videos,
    hasMoreVideos,
    increasePageCount,
  };
};
