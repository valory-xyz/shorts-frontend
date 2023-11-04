// components/VideoCard.jsx
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
        description={<video src={videoUrl} controls />}
      />
    </Card>
  );
};

export default VideoCard;
