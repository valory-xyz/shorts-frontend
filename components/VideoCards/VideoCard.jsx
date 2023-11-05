// components/VideoCard.jsx
import PropTypes from 'prop-types';
import React from 'react';
import { Card } from 'antd';

const VideoCard = ({ videoHash, imageHash, prompt }) => {
  const videoUrl = `https://${process.env.NEXT_PUBLIC_REGISTRY_URL}/${videoHash}`;
  // eslint-disable-next-line no-unused-vars
  const imageUrl = `https://${process.env.NEXT_PUBLIC_REGISTRY_URL}/${imageHash}`;

  return (
    <Card
      hoverable
      // cover={<img alt="Video thumbnail" src={imageUrl} />}
    >
      <Card.Meta
        title={
          // eslint-disable-next-line jsx-a11y/media-has-caption
          <video src={videoUrl} controls />
        }
        description={
          prompt
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
