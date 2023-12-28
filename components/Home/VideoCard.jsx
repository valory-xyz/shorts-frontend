/* eslint-disable jsx-a11y/media-has-caption */
import PropTypes from 'prop-types';
import { Card, Typography } from 'antd';
import styled from 'styled-components';

import { getBlockchainShortsAddress } from 'common-util/Contracts';
import { Video } from 'components/Video';
import Link from 'next/link';

const { Title } = Typography;

const CustomCard = styled(Card)`
  height: 100%;
  max-width: 500px;
  margin: 0 auto;
`;

const EachVideoContainer = styled.div`
  display: flex;
  justify-content: center;
  margin-bottom: 8px;
  video {
    max-height: 500px;
  }
`;

export const VideoCard = ({ id, videoHash, prompt }) => {
  const explorerUrl = getBlockchainShortsAddress(id);

  return (
    <CustomCard>
      <Card.Meta
        title={(
          <EachVideoContainer>
            <Video videoHash={videoHash} />
          </EachVideoContainer>
        )}
        description={(
          <>
            <div className="mb-8">
              <Link href={`/short/${id}`}>
                <Title level={5} className="mt-0">{prompt}</Title>
              </Link>
            </div>
            <a href={explorerUrl} target="_blank" rel="noopener noreferrer">
              View NFT ↗
            </a>
            {/* {' '}
            ·
            {' '}
            <a
              href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(prompt.split(' ').slice(0, 5).join(' '))}... created at https://shorts.wtf%0A&url=${videoUrl}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              Share on Twitter
            </a> */}
          </>
        )}
      />
    </CustomCard>
  );
};

VideoCard.propTypes = {
  videoHash: PropTypes.string.isRequired,
  prompt: PropTypes.string.isRequired,
  id: PropTypes.number.isRequired,
};
