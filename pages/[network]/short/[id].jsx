import { useEffect, useState, useCallback } from 'react';
import Head from 'next/head';

import Short from 'components/Short';
import { getAgentURL } from 'common-util/Contracts';
import { SUPPORTED_CHAIN_ID_BY_CHAIN_SLUG } from 'common-util/constants/supported-chains';
import { useRouter } from 'next/router';

const ShortPage = () => {
  const router = useRouter();
  const { network } = router.query;
  const id = Number(router.query.id) ?? 0;
  const chainId = SUPPORTED_CHAIN_ID_BY_CHAIN_SLUG[network];
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [video, setVideo] = useState(null);

  const fetchVideo = useCallback(async () => {
    if (loading) {
      return;
    }

    setLoading(true);

    try {
      const agentURL = getAgentURL();
      const agentResponsesURL = `${agentURL}/responses?id=${id}`;
      const response = await fetch(agentResponsesURL);
      const data = await response.json();
      setVideo(data.data.find((v) => v.chainId === chainId));
    } catch (error) {
      setErrorMessage(error);
      console.error('Failed to fetch video:', error);
    } finally {
      setLoading(false);
    }
  }, [id, chainId, loading]);

  useEffect(() => {
    if (!id) return;
    if (video) return;
    if (loading) return;
    fetchVideo();
  }, [loading, video, id, fetchVideo]);

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

export default ShortPage;
