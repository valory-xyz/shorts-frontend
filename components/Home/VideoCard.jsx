/* eslint-disable jsx-a11y/media-has-caption */
import PropTypes from 'prop-types';
import { Card, Typography } from 'antd';
import styled from 'styled-components';

import { getBlockchainShortsAddress } from 'common-util/Contracts';
import { Video } from 'components/Video';
import Link from 'next/link';
import { generateShareUrl, videoShape } from 'components/Short';
import { TwitterOutlined } from '@ant-design/icons';
import { SUPPORTED_CHAIN_SLUG_BY_CHAIN_ID } from 'common-util/constants/supported-chains';

const { Title } = Typography;

const CustomCard = styled(Card)`
  height: 100%;
  max-width: 500px;
  margin: 0 auto;
`;

const EachVideoContainer = styled.div`
  display: flex;
  justify-content: center;
  video {
    max-height: 500px;
  }
`;

export const VideoCard = ({ video }) => {
  const { id, video: videoHash, prompt, image: imageHash, chainId } = video;
  const explorerUrl = getBlockchainShortsAddress(id, chainId);
  const shareUrl = generateShareUrl(video);
  const shortUrl = `/${SUPPORTED_CHAIN_SLUG_BY_CHAIN_ID[chainId]}/short/${id}`;

  return (
    <CustomCard bodyStyle={{ padding: 0 }}>
      <Card.Meta
        title={
          <EachVideoContainer>
            <Video videoHash={videoHash} imageHash={imageHash} />
          </EachVideoContainer>
        }
        description={
          <div className="p-16">
            <div className="mb-8">
              <Link href={shortUrl}>
                <Title
                  level={5}
                  className="mt-0"
                  ellipsis={{ rows: 2, expandable: false }}
                >
                  {prompt}
                </Title>
              </Link>
            </div>
            <Link href={shortUrl}>View</Link> ·{' '}
            <a href={explorerUrl} target="_blank" rel="noopener noreferrer">
              NFT ↗
            </a>{' '}
            ·
            <a href={shareUrl} target="_blank" rel="noopener noreferrer">
              <TwitterOutlined /> Share
            </a>
          </div>
        }
        className="mb-0"
      />
    </CustomCard>
  );
};

VideoCard.propTypes = {
  video: PropTypes.shape(videoShape),
};

VideoCard.defaultProps = {
  video: null,
};
