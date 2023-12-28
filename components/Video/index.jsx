import PropTypes from 'prop-types';

export const Video = ({ videoHash }) => {
  const videoUrl = `https://${process.env.NEXT_PUBLIC_REGISTRY_URL}${videoHash}`;

  return (
    <>
      {/* eslint-disable-next-line jsx-a11y/media-has-caption */}
      <video width="100%" height="100%" controls>
        <source src={videoUrl} type="video/mp4" />
        Your browser does not support the video tag.
      </video>
    </>
  );
};

Video.propTypes = {
  videoHash: PropTypes.string.isRequired,
};
