import React, { useEffect, useState } from 'react';
import { Card, Typography, Skeleton } from 'antd';

import { notifyError } from '@autonolas/frontend-library';
import { useRouter } from 'next/router';
import styled from 'styled-components';
import { getIpfsResponse } from 'common-util/functions';
import { DEFAULT_MECH_ADDRESS } from 'common-util/AbiAndAddresses';

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
  const [prompt, setPrompt] = useState('');
  const [account, setAccount] = useState('');

  useEffect(() => {
    // Get the state after navigation
    const storedPrompt = localStorage.getItem('prompt');
    const storedAccount = localStorage.getItem('account');

    if (storedPrompt && storedAccount) {
      setPrompt(storedPrompt);
      setAccount(storedAccount);
    }
  }, []);

  return (
    <Container>
      <Card
        title={(
          <>
            {true ? (
              <Typography.Text>
                Account: {account}
              </Typography.Text>
            ) : (
              <pre></pre>
            )}
          </>
        )}
      >
        { false ? (
          <Skeleton active />
        ) : (
          <Typography.Text>Prompt: {prompt}</Typography.Text>
        )}
      </Card>
    </Container>
  );
};
