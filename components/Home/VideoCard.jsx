/* eslint-disable jsx-a11y/media-has-caption */
import PropTypes from 'prop-types';
import React from 'react';
import { Card } from 'antd';
import { getBlockchainShortsAddress } from 'common-util/Contracts';

const VideoCard = ({
  id,
  videoHash,
  // imageHash,
  prompt,
}) => {
  const videoUrl = `https://${process.env.NEXT_PUBLIC_REGISTRY_URL}/${videoHash}`;
  // const imageUrl = `https://${process.env.NEXT_PUBLIC_REGISTRY_URL}/${imageHash}`;
  const scanUrl = getBlockchainShortsAddress(id);

  return (
    <Card>
      <Card.Meta
        title={(
          <div>
            <video width="100%" height="100%" controls>
              <source src={videoUrl} type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          </div>
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
    </Card>
  );
};

VideoCard.propTypes = {
  videoHash: PropTypes.string.isRequired, // or PropTypes.array if it's not required
  // imageHash: PropTypes.string.isRequired, // or PropTypes.array if it's not required
  prompt: PropTypes.string.isRequired, // or PropTypes.array if it's not required
  id: PropTypes.number.isRequired,
};

export default VideoCard;
