import React, { useState, useEffect } from 'react';
import {
  Form,
  Input,
  Button,
  Card,
  ConfigProvider,
  Typography,
  Alert,
  Tooltip,
} from 'antd';
import { useRouter } from 'next/router';
import { notifyError, notifySuccess } from '@autonolas/frontend-library';

import { GREEN_THEME } from 'util/theme';
import { useHelpers } from 'common-util/hooks';
import {
  getMechContract,
  getAgentMultisig,
  getAgentURL,
} from 'common-util/Contracts';
import { QuestionCircleOutlined } from '@ant-design/icons';
import { PoweredByOlas } from 'components/PoweredByOlas';

const { Text } = Typography;

const FORM_NAME = 'ipfs_creation_form_for_mech';
const FORM_ID = 'myForm';

const ESTIMATED_GAS_LIMIT = 500_000;
const BUFFER_FACTOR = 1.2;

const getEstimatedGasLimit = async (fn, account) => {
  if (!account) {
    throw new Error('Invalid account passed to estimate gas limit');
  }

  try {
    const estimatedGas = await fn.estimateGas({ from: account });
    // round up to nearest 1000 and add a buffer
    return Math.floor(estimatedGas * BUFFER_FACTOR);
  } catch (error) {
    window.console.warn(
      `Error occured on estimating gas, defaulting to ${ESTIMATED_GAS_LIMIT}`,
    );
  }

  return ESTIMATED_GAS_LIMIT;
};

export const RequestForm = () => {
  const [form] = Form.useForm();
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const {
    account,
    queueTimeInSeconds,
    updateQueueTime,
    queueTimeInHms,
    isQueueTimeAboveThreshold,
  } = useHelpers();

  useEffect(() => {
    updateQueueTime();

    const interval = setInterval(() => {
      updateQueueTime();
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const onFinishFailed = (errorInfo) => {
    window.console.warn('Failed:', errorInfo);
  };

  const getRequestData = (formValues) => {
    // Store the prompt and account in local storage
    localStorage.setItem('prompt', formValues.prompt);
    localStorage.setItem('account', account);

    // Prepare the request data
    const requestData = {
      address: account,
      prompt: formValues.prompt,
      tool: 'short-maker',
    };

    return requestData;
  };

  const generateVideoTransaction = async (agentURL, values, result) => {
    // Perform the HTTP POST request only after confirming the transaction
    try {
      const response = await fetch(`${agentURL}/generate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'text/plain',
          // Authorization: `${process.env.NEXT_PUBLIC_AGENT_AUTH}`,
        },
        body: JSON.stringify(getRequestData(values)),
        // mode: 'no-cors', // TODO
      });

      // Check if the request was successful
      if (response.ok) {
        const jsonResponse = await response.json();
        window.console.log({ jsonResponse });
      } else {
        throw new Error('Request to agent failed');
      }
    } catch (error) {
      console.error('Error making the POST request:', error);
      notifyError('Oops - looks like the agent is down :(');
    }

    // Redirect to the requests page
    const senderAccount = result.events.Subscription.returnValues.sender;
    router.push({ pathname: `/requests/${senderAccount}` });
  };

  const onFinish = async (values) => {
    if (isQueueTimeAboveThreshold) {
      notifyError('The queue is too long. Please try again later.');
      return;
    }

    const contract = getMechContract();
    const agentMultisigAddress = getAgentMultisig();
    const agentURL = getAgentURL();

    try {
      setIsLoading(true);

      const price = await contract.methods.price().call();

      const subscriptionFn = contract.methods.subscribe(agentMultisigAddress);
      const estimatedGas = await getEstimatedGasLimit(subscriptionFn, account);
      const result = await subscriptionFn.send({
        from: account,
        gasLimit: estimatedGas,
        value: price,
      });

      notifySuccess(
        <a
          href={`https://gnosisscan.io/tx/${result.transactionHash}`}
          target="_blank"
          rel="noopener noreferrer"
        >
          Transaction executed
        </a>,
        'Upon delivery you will be notified!',
      );

      await generateVideoTransaction(agentURL, values, result);
    } catch (e) {
      console.error(e);
      notifyError("Couldn't execute transaction");
    } finally {
      setIsLoading(false);
    }
  };

  const getQueueTimeMessage = () => {
    if (queueTimeInSeconds == null) return queueTimeInHms;

    return queueTimeInSeconds < 60 ? 'no queue rn 🍀' : queueTimeInHms;
  };

  return (
    <Card
      title="Generate a short film"
      className="mb-12"
      style={{
        width: '100%',
        maxWidth: 450,
        boxShadow:
          '0 1px 2px -2px rgba(0, 0, 0, 0.16), 0 3px 6px 0 rgba(0, 0, 0, 0.12), 0 5px 12px 4px rgba(0, 0, 0, 0.09)',
      }}
    >
      <Form
        form={form}
        name={FORM_NAME}
        layout="vertical"
        autoComplete="off"
        preserve={false}
        id={FORM_ID}
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
        className="mb-12"
      >
        <Form.Item
          className="mb-12"
          name="prompt"
          rules={[
            {
              required: true,
              message: 'Write a prompt',
            },
          ]}
        >
          <Input.TextArea
            rows={4}
            placeholder="Write a prompt – see examples below"
          />
        </Form.Item>

        <Form.Item className="mb-8">
          <ConfigProvider theme={GREEN_THEME}>
            <Button
              form={FORM_ID}
              htmlType="submit"
              type="primary"
              disabled={!account || isQueueTimeAboveThreshold}
              loading={isLoading}
            >
              Mint
            </Button>
          </ConfigProvider>
        </Form.Item>
        <Text type="secondary">
          Estimated queue time:
          {' '}
          {getQueueTimeMessage()}
          {' '}
          <Tooltip title="If you mint now, this is how long you can expect to wait for delivery">
            <QuestionCircleOutlined />
          </Tooltip>
        </Text>
        {isQueueTimeAboveThreshold && (
          <Alert
            className="mt-8"
            type="warning"
            message="Minting is paused – the queue is too long. Please check back later."
          />
        )}
      </Form>
      <PoweredByOlas />
    </Card>
  );
};
