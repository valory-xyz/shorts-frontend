import { useEffect, useState, useCallback } from 'react';
import Head from 'next/head';

import Short from 'components/Short';
import { getAgentURL } from 'common-util/Contracts';
import { useRouter } from 'next/router';
import { useHelpers } from 'common-util/hooks';

const ShortContent = () => {
  const router = useRouter();
  const { chainId } = useHelpers();

  const { id: queryId, network } = router.query;
  const id = Number(queryId);

  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');
  const [video, setVideo] = useState(null);

  const fetchVideo = useCallback(async () => {
    try {
      const agentURL = getAgentURL();
      const agentResponsesURL = `${agentURL}/responses?id=${id}`;
      const response = await fetch(agentResponsesURL);
      const jsonResponse = await response.json();
      const currentChainVideo = jsonResponse.data.find(
        (v) => v.chainId === chainId,
      );
      if (!currentChainVideo) {
        throw new Error('Video not found');
      }
      setVideo(currentChainVideo);
    } catch (error) {
      setErrorMessage(error?.message || 'Failed to fetch video');
      console.error('Failed to fetch video:', error);
    } finally {
      setLoading(false);
    }
  }, [id, chainId]);

  useEffect(() => {
    fetchVideo();
  }, [fetchVideo]);

  const truncatedTitle = video?.prompt
    ? `${video.prompt.substring(0, 50)}...`
    : 'Short Video';
  const imageUrl = `https://${process.env.NEXT_PUBLIC_REGISTRY_URL}${video?.image}`;
  const title = `${truncatedTitle} | Shorts.WTF`;
  const description =
    'Shorts.WTF is a creative tool for generating AI videos. It aggregates video, music and narration, all in one. Powered by Olas agents. Make your own at https://shorts.wtf.';
  const url = `https://shorts.wtf/${network}/short/${id}`;

  if (!network || !id) {
    return null;
  }

  return (
    <>
      <Head>
        {/* <!-- Primary Meta Tags --> */}
        <title>{title}</title>
        <meta name="title" content={`${truncatedTitle} | Shorts.WTF`} />
        <meta name="description" content={description} />

        {/* <!-- Open Graph / Facebook --> */}
        <meta property="og:type" content="website" />
        <meta property="og:url" content={url} />
        <meta property="og:title" content={title} />
        <meta property="og:description" content={description} />
        <meta property="og:image" content={imageUrl} />

        {/* <!-- Twitter --> */}
        <meta property="twitter:card" content="summary_large_image" />
        <meta property="twitter:url" content={url} />
        <meta property="twitter:title" content={title} />
        <meta property="twitter:description" content={description} />
        <meta property="twitter:image" content={imageUrl} />
      </Head>
      <Short video={video} errorMessage={errorMessage} loading={loading} />
    </>
  );
};

const ShortPage = () => {
  const router = useRouter();
  const { network } = router.query;
  const id = Number(router.query.id);
  const { chainId } = useHelpers();

  if (!network || !id || !chainId) {
    return null;
  }

  return <ShortContent />;
};

export default ShortPage;
