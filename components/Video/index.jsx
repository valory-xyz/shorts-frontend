import PropTypes from 'prop-types';
import styled from 'styled-components';

const StyledVideo = styled.video`
  width: 100%;
  aspect-ratio: 1 / 1;
`;

export const Video = ({ videoHash }) => {
  const videoUrl = `https://${process.env.NEXT_PUBLIC_REGISTRY_URL}${videoHash}`;

  return (
    <>
      {/* eslint-disable-next-line jsx-a11y/media-has-caption */}
      <StyledVideo controls>
        <source src={videoUrl} type="video/mp4" />
        Your browser does not support the video tag.
      </StyledVideo>
    </>
  );
};

Video.propTypes = {
  videoHash: PropTypes.string,
};

Video.defaultProps = {
  videoHash: '',
};
