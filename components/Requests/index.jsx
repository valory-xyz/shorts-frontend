import React, { useEffect, useState } from 'react';
import { Card, Typography } from 'antd';

import styled from 'styled-components';

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
          <Typography.Text>
            Account:
            {account}
          </Typography.Text>
        )}
      >
        <Typography.Text>
          Prompt:
          {prompt}
        </Typography.Text>
      </Card>
    </Container>
  );
};
