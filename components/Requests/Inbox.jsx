import {
  useManageSubscription,
  useSubscription,
  useW3iAccount,
  useInitWeb3InboxClient,
  useMessages,
} from '@web3inbox/widget-react';
import { Col, Row, Typography } from 'antd';
import { useCallback, useEffect } from 'react';
import { useSignMessage, useAccount } from 'wagmi';

const { Text } = Typography;

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
    // (including `app.example.com`), not just `window.location.host`
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

    try {
      await register((message) => signMessageAsync({ message }));
    } catch (registerIdentityError) {
      // alert(registerIdentityError);
    }
  }, [signMessageAsync, register, address]);

  useEffect(() => {
    // Register even if an identity key exists, to account for stale keys
    performRegistration();
  }, [performRegistration]);

  const { isSubscribed, isSubscribing, subscribe } = useManageSubscription();

  const performSubscribe = useCallback(async () => {
    // Register again just in case
    await performRegistration();
    await subscribe();
  }, [subscribe, isRegistered]);

  // eslint-disable-next-line no-unused-vars
  const { subscription } = useSubscription();
  const { messages } = useMessages();

  if (!isReady) {
    return <Text>Loading client...</Text>;
  }

  if (!address) {
    return <Text>Connect your wallet</Text>;
  }

  return (
    <>
      <Row gutter={[16, 16]}>
        <Col>
          <Text>{`Address: ${address}`}</Text>
        </Col>

        <Col>
          <Text>{`Account ID:${account}`}</Text>
        </Col>
      </Row>

      {!isRegistered ? (
        <div>
          To manage notifications, sign and register an identity key:&nbsp;
          <button
            type="button"
            onClick={performRegistration}
            disabled={isRegistering}
          >
            {isRegistering ? 'Signing...' : 'Sign'}
          </button>
        </div>
      ) : (
        <>
          {!isSubscribed ? (
            <button
              type="button"
              onClick={performSubscribe}
              disabled={isSubscribing}
            >
              {isSubscribing ? 'Subscribing...' : 'Subscribe to notifications'}
            </button>
          ) : (
            <>
              <div>You are subscribed!</div>
              <div />
              <div className="email-list">
                {messages.map((message) => (
                  <div key={message.id} className="email-item">
                    <div className="email-item-header">
                      <h4 className="email-item-title">
                        {message.message.title}
                      </h4>
                      <div className="email-item-date">
                        {new Date(message.publishedAt).toLocaleString([], {
                          year: 'numeric',
                          month: 'numeric',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                          second: '2-digit',
                        })}
                      </div>
                    </div>
                    <div className="email-item-body">
                      <p>{message.message.body}</p>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </>
      )}
    </>
  );
}
