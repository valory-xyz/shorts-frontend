import {
  useManageSubscription,
  useW3iAccount,
  useInitWeb3InboxClient,
} from '@web3inbox/widget-react';
import {
  Button, Col, Popover, Row, Typography,
} from 'antd';
import { useCallback, useEffect } from 'react';
import { useSignMessage, useAccount } from 'wagmi';
import { QuestionCircleOutlined } from '@ant-design/icons';

import { notifyError, notifySuccess } from '@autonolas/frontend-library';

const { Text, Title } = Typography;

export default function App() {
  const { address } = useAccount();
  const { signMessageAsync } = useSignMessage();
  const projectId = process.env.NEXT_PUBLIC_WALLET_PROJECT_ID;

  // Initialize the Web3Inbox SDK
  const isReady = useInitWeb3InboxClient({
    // The project ID and domain you setup in the Domain Setup section
    projectId,
    domain: 'shorts.wtf',

    // Allow localhost development with "unlimited" mode.
    // This authorizes this dapp to control notification subscriptions for all domains
    // (including `shorts.wtf`), not just `window.location.host`
    isLimited: false,
  });

  const {
    account, setAccount, isRegistered, isRegistering, register,
  } = useW3iAccount();

  useEffect(() => {
    if (!address) return;

    // Convert the address into a CAIP-10 blockchain-agnostic account ID
    // and update the Web3Inbox SDK with it
    setAccount(`eip155:1:${address}`);
  }, [address, setAccount]);

  // In order to authorize the dapp to control subscriptions, the user needs
  // to sign a SIWE message which happens automatically when `register()` is called.
  // Depending on the configuration of `domain` and `isLimited`, a different message
  // is generated.
  const performRegistration = useCallback(async () => {
    if (!address) return;
    await register((message) => signMessageAsync({ message }));
  }, [signMessageAsync, register, address]);

  const { isSubscribed, isSubscribing, subscribe } = useManageSubscription(account);

  const performSubscribe = useCallback(async () => {
    try {
      await performRegistration();
      await subscribe();
      notifySuccess('Subscribed to notifications');
    } catch (error) {
      notifyError('Failed to subscribe to notifications');
    }
  }, [subscribe, isRegistered]);

  if (!isReady) {
    return <Text>Loading client...</Text>;
  }

  if (!address) {
    return <Text>Connect your wallet</Text>;
  }

  const info = (
    <Row>
      <Col style={{ marginBottom: 16 }}>
        To manage notifications, sign and register an identity key:&nbsp;
      </Col>

      <Col>
        <Text strong>Address:</Text>
      </Col>
      <Col>
        <Text>{`${address}`}</Text>
      </Col>

      <Col style={{ marginTop: 16 }}>
        <Text strong>Account ID:</Text>
      </Col>
      <Col>
        <Text>{`${account}`}</Text>
      </Col>
    </Row>
  );

  return (
    <>
      {!isRegistered || !isSubscribed ? (
        <div>
          <Typography.Title level={5}>Get notified when your film is ready</Typography.Title>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <Button
              type="primary"
              onClick={performSubscribe}
              disabled={isRegistering || isSubscribing}
              loading={isRegistering || isSubscribing}
            >
              {isRegistering || isSubscribing
                ? 'Subscribing...'
                : 'Subscribe to in-app notifications'}
            </Button>

            <Popover
              content={info}
              title="Stay informed with Wallet Connect notifications!"
              placement="right"
              overlayStyle={{ width: '400px' }}
            >
              <QuestionCircleOutlined style={{ fontSize: 24 }} />
            </Popover>
          </div>
        </div>
      ) : (
        <Title level={4}>You have subscribed to notifications!</Title>
      )}
    </>
  );
}
