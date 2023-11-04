import React, { useEffect, useState } from 'react';
import { Card, Typography, Skeleton } from 'antd';

import { notifyError } from '@autonolas/frontend-library';
import { useRouter } from 'next/router';
import styled from 'styled-components';
import { getIpfsResponse } from 'common-util/functions';
import { DEFAULT_MECH_ADDRESS } from 'common-util/AbiAndAddresses';
import { useDeliver } from './useDeliver';

const Container = styled.div`
  .ant-card {
    width: 620px;
    .ant-card-head {
      overflow: auto;
    }
    pre {
      overflow: auto;
    }
  }
`;

export const Request = () => {
  const router = useRouter();
  const requestId = router.query.id;
  const [isIpfsLoading, setIsIpfsLoading] = useState(true);
  const [ipfsData, setIpfsData] = useState();

  const { data } = useDeliver(requestId);

  useEffect(() => {
    const getData = async () => {
      try {
        const response = await getIpfsResponse(data.data, data.requestId);
        setIpfsData(response);
      } catch (error) {
        notifyError('Error fetching metadata from IPFS', error);
      } finally {
        setIsIpfsLoading(false);
      }
    };

    if (data?.requestId && data?.data) {
      getData();
    }
  }, [data?.requestId, data?.data]);

  const truncatedRequestId = requestId.length > 10
    ? `${requestId.slice(0, 5)}...${requestId.slice(-5)}`
    : requestId;

  return (
    <Container>
      <Card
        title={(
          <>
            {isIpfsLoading ? (
              <Typography.Text>
                Waiting for Mech to deliver your result...
              </Typography.Text>
            ) : (
              <pre>{ipfsData.prompt}</pre>
            )}
          </>
        )}
      >
        {isIpfsLoading ? (
          <Skeleton active />
        ) : (
          <Typography.Text>{ipfsData.result}</Typography.Text>
        )}
      </Card>
      <div className="mt-8">
        <Typography.Text type="secondary">
          {` Request ID: ${truncatedRequestId} · `}
          <a
            href={`https://shorts.wtf/mech/${DEFAULT_MECH_ADDRESS}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            View request on MechHub ↗
          </a>
        </Typography.Text>
      </div>
    </Container>
  );
};
