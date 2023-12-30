import PropTypes from 'prop-types';
import styled from 'styled-components';
import Image from 'next/image';
import { useState } from 'react';
import { PlayCircleFilled } from '@ant-design/icons';
import { COLOR } from '@autonolas/frontend-library';

const StyledVideoContainer = styled.div`
  width: 100%;
  aspect-ratio: 1 / 1;
  position: relative;
  cursor: pointer;
  background-color: black; /* Ensure background is black for when image fails to load */
`;

const StyledVideo = styled.video`
  width: 100%;
  aspect-ratio: 1 / 1;
`;

const PlayButton = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
`;

export const Video = ({ videoHash, imageHash }) => {
  const [showVideo, setShowVideo] = useState(false);

  const createUrl = (hash) => `https://${process.env.NEXT_PUBLIC_REGISTRY_URL}${hash}`;
  const videoUrl = createUrl(videoHash);
  const imageUrl = createUrl(imageHash);

  const handleVideoClick = () => {
    setShowVideo(true);
  };

  return (
    <StyledVideoContainer onClick={handleVideoClick}>
      {showVideo ? (
        <>
          {/* eslint-disable-next-line jsx-a11y/media-has-caption */}
          <StyledVideo controls autoPlay>
            <source src={videoUrl} type="video/mp4" />
            Your browser does not support the video tag.
          </StyledVideo>
        </>
      ) : (
        <>
          <Image
            src={imageUrl}
            layout="fill"
            objectFit="cover"
            onClick={handleVideoClick}
            alt="Video thumbnail"
            onError={(e) => {
              e.target.onerror = null;
              e.target.style.display = 'none';
            }}
          />
          <PlayButton>
            <PlayCircleFilled style={{ fontSize: '3rem', color: COLOR.WHITE }} />
          </PlayButton>
        </>
      )}
    </StyledVideoContainer>
  );
};

Video.propTypes = {
  videoHash: PropTypes.string.isRequired,
  imageHash: PropTypes.string.isRequired,
};
