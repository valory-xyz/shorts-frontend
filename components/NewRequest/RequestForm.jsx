import React, { useState } from 'react';
import {
  Form, Input, Button, Card, ConfigProvider,
} from 'antd';
import { v4 as uuidv4 } from 'uuid';
import { useRouter } from 'next/router';
import { notifyError, notifySuccess } from '@autonolas/frontend-library';

import { GREEN_THEME } from 'util/theme';
import { useHelpers } from 'common-util/hooks';
import { getMechContract } from 'common-util/Contracts';
import { getIpfsHashHelper } from './helpers';

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

  const onFinish = async (values) => {
    try {
      setIsLoading(true);

      const hash = await getIpfsHashHelper(
        { ...values, nonce: uuidv4() },
        { noImage: true },
      );

      try {
        const contract = getMechContract();
        const price = await contract.methods.price().call();

        await contract.methods
          .request(`0x${hash}`)
          .send({ from: account, value: price })
          .then((result) => {
            notifySuccess(
              'Transaction executed',
              'Delivery may take several seconds.',
            );
            router.push(
              `/requests/${result.events.Request.returnValues.requestId}`,
            );
          });
      } catch (e) {
        console.error(e);
        notifyError("Couldn't execute transaction");
      } finally {
        setIsLoading(false);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card title="Imagine your content ..." style={{ width: 420 }}>
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
          rules={[{ required: true, message: 'Please write a short prompt to guide your AIContentGeneratooorr.' }]}
        >
          <Input.TextArea
            rows={2}
            placeholder="... write a short prompt to guide your AIContentGeneratooorr."
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

RequestForm.propTypes = {};

RequestForm.defaultProps = {};
