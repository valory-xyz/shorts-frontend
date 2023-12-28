import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';

import Short from 'components/Short';
import { getAgentURL } from 'common-util/Contracts';

const ShortPage = () => {
  const router = useRouter();
  const { id } = router.query;
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [video, setVideo] = useState(null);

  const fetchVideo = async () => {
    if (loading) {
      return;
    }

    setLoading(true);

    try {
      const agentURL = getAgentURL();
      const agentResponsesURL = `${agentURL}/responses?id=${id}`;
      const response = await fetch(agentResponsesURL);
      const data = await response.json();
      // TODO: remove [0] once filtering is in place?
      setVideo(data.data[0]);
    } catch (error) {
      setErrorMessage(error);
      console.error('Failed to fetch video:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVideo();
  }, []);

  const truncatedTitle = video?.prompt
    ? `${video.prompt.substring(0, 50)}...`
    : 'Short Video';
  const imageUrl = `https://${process.env.NEXT_PUBLIC_REGISTRY_URL}${video?.image}`;

  return (
    <>
      <Head>
        <title>{`${truncatedTitle} | Shorts.WTF`}</title>
        <meta
          name="description"
          content="Shorts.WTF is a creative tool for generating AI videos. It aggregates video, music and narration, all in one. Powered by Olas agents. Make your own at https://shorts.wtf."
        />
        <meta
          property="og:title"
          content={`${truncatedTitle} | created using Shorts.WTF`}
        />
        <meta
          property="og:description"
          content="Shorts.WTF is a creative tool for generating AI videos. It aggregates video, music and narration, all in one. Powered by Olas agents. Make your own at https://shorts.wtf."
        />
        <meta property="og:image" content={imageUrl} />
        <meta property="og:url" content={`https://shorts.wtf/short/${id}`} />
        <meta property="og:type" content="video.movie" />
        <meta property="og:site_name" content="Shorts.WTF" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta
          name="twitter:title"
          content={`${truncatedTitle} | created using shorts.wtf`}
        />
        <meta
          name="twitter:description"
          content="Shorts.WTF is a creative tool for generating AI videos. It aggregates video, music and narration, all in one. Powered by Olas agents. Make your own at https://shorts.wtf."
        />
        <meta name="twitter:image" content={imageUrl} />
        <meta name="twitter:site" content="@shorts.wtf" />
        <meta name="twitter:creator" content="@shorts.wtf" />
      </Head>
      <Short video={video} errorMessage={errorMessage} loading={loading} />
    </>
  );
};

export default ShortPage;
