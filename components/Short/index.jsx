import { useState } from 'react';
import PropTypes from 'prop-types';
import { FrownTwoTone, TwitterOutlined } from '@ant-design/icons';
import { COLOR } from '@autonolas/frontend-library';
import {
  Button,
  Col, Result, Row, Skeleton, Typography,
} from 'antd';

import { Video } from 'components/Video';

const Error = ({ errorMessage }) => (
  <Result
    icon={<FrownTwoTone twoToneColor={COLOR.GREY_1} />}
    title="Couldn't fetch short"
    subTitle={JSON.stringify(errorMessage)}
  />
);

Error.propTypes = {
  errorMessage: PropTypes.string,
};

Error.defaultProps = {
  errorMessage: '',
};

const Short = ({ video, loading, errorMessage }) => {
  const [expanded, setExpanded] = useState(false);

  if (errorMessage) {
    return <Error errorMessage={errorMessage} />;
  }

  return (
    <Row align={expanded ? 'top' : 'middle'} gutter={48}>
      <Col md={12}>
        <div style={{ width: '100%' }}>
          {loading ? <Skeleton active paragraph={false} /> : <Video videoHash={video?.video} />}
        </div>
      </Col>
      <Col md={12}>
        {loading ? <Skeleton active /> : (
          <>
            <Typography.Title
              level={4}
              className="mt-0"
              ellipsis={{
                rows: 3,
                expandable: true,
                onExpand: () => setExpanded(true),
              }}
            >
              {video?.prompt}
            </Typography.Title>
            <Typography.Text type="secondary">
              ID:
              {' '}
              {video?.id}
            </Typography.Text>
            <br />
            <br />
            <Button
              icon={<TwitterOutlined />}
              onClick={() => {
                const truncatedTitle = video?.prompt
                  ? `${video.prompt.substring(0, 50)}...`
                  : 'Short Video';
                const tweetUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(
                  `"${truncatedTitle}" created using shorts.wtf\n\n🎥 Watch now: https://shorts.wtf/short/${video?.id}`,
                )}`;
                window.open(tweetUrl, '_blank');
              }}
            >
              Share
            </Button>
          </>
        )}
      </Col>
    </Row>
  );
};

Short.propTypes = {
  video: PropTypes.shape({
    id: PropTypes.string,
    video: PropTypes.string,
    prompt: PropTypes.string,
  }),
  loading: PropTypes.bool,
  errorMessage: PropTypes.string,
};

Short.defaultProps = {
  video: null,
  loading: false,
  errorMessage: '',
};

export default Short;
