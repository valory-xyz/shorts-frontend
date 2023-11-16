import React, { useState } from 'react';
import {
  Form, Input, Button, Card, ConfigProvider,
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

const FORM_NAME = 'ipfs_creation_form_for_mech';
const FORM_ID = 'myForm';

export const RequestForm = () => {
  const [form] = Form.useForm();
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { account } = useHelpers();

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
    try {
      setIsLoading(true);

      const contract = getMechContract();
      const agentMultisigAddress = getAgentMultisig();
      const agentURL = getAgentURL();
      const price = await contract.methods.price().call();

      const result = await contract.methods
        .subscribe(agentMultisigAddress)
        .send({ from: account, value: price });

      notifySuccess(
        <a
          href={result.transactionHash}
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

  return (
    <Card
      title="Generate a short film"
      className="mb-12"
      style={{
        width: 500,
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
      >
        <Form.Item
          // label="Prompt"
          name="prompt"
          rules={[
            {
              required: true,
              message: 'Write a prompt to guide your AI content Generatooorr.',
            },
          ]}
        >
          <Input.TextArea
            rows={4}
            placeholder="Write a prompt to guide your AI content Generatooorr."
          />
        </Form.Item>

        <Form.Item>
          <ConfigProvider theme={GREEN_THEME}>
            <Button
              form={FORM_ID}
              htmlType="submit"
              type="primary"
              disabled={!account}
              loading={isLoading}
            >
              Go
            </Button>
          </ConfigProvider>
        </Form.Item>
      </Form>
    </Card>
  );
};
