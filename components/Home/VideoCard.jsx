/* eslint-disable jsx-a11y/media-has-caption */
import PropTypes from 'prop-types';
import { Card } from 'antd';
import styled from 'styled-components';

import { getBlockchainShortsAddress } from 'common-util/Contracts';

const EachVideoContainer = styled.div`
  display: flex;
  justify-content: center;
`;

const CustomCard = styled(Card)`
  /* max-width: 500px; */
  .ant-card-meta-description {
    display: flex;
    flex-direction: column;
    align-items: center;
  }
`;

export const VideoCard = ({
  id,
  videoHash,
  // imageHash,
  prompt,
}) => {
  const videoUrl = `https://${process.env.NEXT_PUBLIC_REGISTRY_URL}/${videoHash}`;
  // const imageUrl = `https://${process.env.NEXT_PUBLIC_REGISTRY_URL}/${imageHash}`;
  const scanUrl = getBlockchainShortsAddress(id);

  return (
    <CustomCard
      hoverable
      style={{ height: '100%' }}
      // cover={<img alt="Video thumbnail" src={imageUrl} />}
    >
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
  videoHash: PropTypes.string.isRequired, // or PropTypes.array if it's not required
  // imageHash: PropTypes.string.isRequired, // or PropTypes.array if it's not required
  prompt: PropTypes.string.isRequired, // or PropTypes.array if it's not required
  id: PropTypes.number.isRequired,
};
