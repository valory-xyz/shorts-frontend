// components/VideoCard.jsx
import PropTypes from 'prop-types';
import React from 'react';
import { Card } from 'antd';

const VideoCard = ({ videoHash, imageHash, prompt }) => {
  const videoUrl = `https://ipfs.io/ipfs/${videoHash}`;
  const imageUrl = `https://ipfs.io/ipfs/${imageHash}`;

  return (
    <Card
      hoverable
      cover={<img alt="Video thumbnail" src={imageUrl} />}
    >
      <Card.Meta
        title={prompt}
        description={
          // eslint-disable-next-line jsx-a11y/media-has-caption
          <video src={videoUrl} controls />
        }
      />
    </Card>
  );
};

VideoCard.propTypes = {
  videoHash: PropTypes.array.isRequired, // or PropTypes.array if it's not required
  imageHash: PropTypes.array.isRequired, // or PropTypes.array if it's not required
  prompt: PropTypes.array.isRequired, // or PropTypes.array if it's not required
};

export default VideoCard;
