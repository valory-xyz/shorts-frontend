/* eslint-disable jsx-a11y/media-has-caption */
import PropTypes from 'prop-types';
import { Card } from 'antd';
import styled from 'styled-components';

import { getBlockchainShortsAddress } from 'common-util/Contracts';

const CustomCard = styled(Card)`
  height: 100%;
  .ant-card-meta-description {
    display: flex;
    flex-direction: column;
    align-items: center;
  }
`;

const EachVideoContainer = styled.div`
  display: flex;
  justify-content: center;
  video {
    max-height: 500px;
  }
`;

export const VideoCard = ({ id, videoHash, prompt }) => {
  const videoUrl = `https://${process.env.NEXT_PUBLIC_REGISTRY_URL}/${videoHash}`;
  const scanUrl = getBlockchainShortsAddress(id);

  return (
    <CustomCard hoverable>
      <Card.Meta
        title={(
          <EachVideoContainer>
            <video width="100%" height="100%" controls>
              <source src={videoUrl} type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          </EachVideoContainer>
        )}
        description={(
          <>
            <div className="mb-8">{prompt}</div>
            <a href={scanUrl} target="_blank" rel="noopener noreferrer">
              View NFT ↗
            </a>
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
