import { useState } from 'react';
import PropTypes from 'prop-types';
import { FrownTwoTone, TwitterOutlined } from '@ant-design/icons';
import { COLOR } from '@autonolas/frontend-library';
import {
  Button, Col, Result, Row, Skeleton, Typography,
} from 'antd';

import { Video } from 'components/Video';
import { getBlockchainShortsAddress } from 'common-util/Contracts';
import { useRouter } from 'next/router';

export const generateShareUrl = (video) => {
  const truncatedTitle = video?.prompt
    ? `${video.prompt.substring(0, 50)}...`
    : 'Short Video';

  return `https://twitter.com/intent/tweet?text=${encodeURIComponent(
    `"${truncatedTitle}" created using shorts.wtf\n\n🎥 Watch now: https://shorts.wtf/short/${video?.id}`,
  )}`;
};

const ShareButton = ({ video }) => {
  const handleShare = () => {
    const tweetUrl = generateShareUrl(video);
    window.open(tweetUrl, '_blank');
  };

  return (
    <Button icon={<TwitterOutlined />} onClick={handleShare}>
      Share
    </Button>
  );
};

ShareButton.propTypes = {
  video: PropTypes.shape({
    id: PropTypes.number,
    prompt: PropTypes.string,
  }),
};

ShareButton.defaultProps = {
  video: null,
};

const Error = ({ errorMessage }) => (
  <Result
    icon={<FrownTwoTone twoToneColor={COLOR.GREY_1} />}
    title="Couldn't fetch short"
    subTitle={JSON.stringify(errorMessage)}
  />
);

Error.propTypes = {
  errorMessage: PropTypes.string,
};

Error.defaultProps = {
  errorMessage: '',
};

const Short = ({ video, loading, errorMessage }) => {
  const [expanded, setExpanded] = useState(false);
  const router = useRouter();
  const { id } = router.query;

  const { video: videoHash, image: imageHash } = video || { video: undefined, image: undefined };

  const explorerUrl = getBlockchainShortsAddress(id);

  if (errorMessage) {
    return <Error errorMessage={errorMessage} />;
  }

  return (
    <Row align={expanded ? 'top' : 'middle'} gutter={48}>
      <Col md={12}>
        <div style={{ width: '100%' }} className="mb-12">
          {loading ? <Skeleton active /> : <Video videoHash={videoHash} imageHash={imageHash} />}
        </div>
      </Col>
      <Col md={12}>
        {loading ? (
          <Skeleton active />
        ) : (
          <>
            <Typography.Title
              level={4}
              className="mt-0"
              ellipsis={{
                rows: 3,
                expandable: true,
                onExpand: () => setExpanded(true),
              }}
            >
              {video?.prompt}
            </Typography.Title>
            <Typography.Text type="secondary">
              ID:
              {' '}
              {video?.id}
              {' '}
              ·
              {' '}
              <a href={explorerUrl} target="_blank" rel="noopener noreferrer">
                NFT ↗
              </a>
            </Typography.Text>
            <br />
            <br />
            <ShareButton video={video} />
          </>
        )}
      </Col>
    </Row>
  );
};

export const videoShape = {
  id: PropTypes.number,
  video: PropTypes.string,
  prompt: PropTypes.string,
};

Short.propTypes = {
  video: PropTypes.shape(videoShape),
  loading: PropTypes.bool,
  errorMessage: PropTypes.string,
};

Short.defaultProps = {
  video: null,
  loading: false,
  errorMessage: '',
};

export default Short;
