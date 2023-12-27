import React, { useEffect, useState } from 'react';
import { Card, Typography } from 'antd';

import styled from 'styled-components';
import Link from 'next/link';

const { Title, Text } = Typography;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 2rem;
  .ant-card {
    width: 680px;
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
  const [account, setAccount] = useState(''); // eslint-disable-line

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
      <Card>
        <Title level={4} className="mt-0">
          Great! Your short film is being generated
        </Title>
        <Text className="mb-8">
          Check the
          {' '}
          <Link href="/">video list</Link>
          {' '}
          in roughly 30 minutes to see it.
        </Text>
        <Title level={5} className="mt-0">Your prompt</Title>
        <Text>{prompt || '--'}</Text>
      </Card>
    </Container>
  );
};
