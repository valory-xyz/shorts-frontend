import { List } from 'antd';
import { useMessages } from '@web3inbox/widget-react';
import { useHelpers } from 'common-util/hooks';

const dateFormat = {
  year: 'numeric',
  month: 'numeric',
  day: 'numeric',
  hour: '2-digit',
  minute: '2-digit',
  second: '2-digit',
};

export const Notifications = () => {
  const { account } = useHelpers();
  const { messages } = useMessages(account);

  return (
    <List
      itemLayout="horizontal"
      dataSource={messages}
      renderItem={(notification, index) => (
        <List.Item key={`notification-${index}`}>
          <List.Item.Meta
            avatar={(
              <>
                {new Date(notification.publishedAt).toLocaleString(
                  [],
                  dateFormat,
                )}
              </>
            )}
            title={
              <a href="https://ant.design">{notification.message.title}</a>
            }
            description={notification.message.body}
          />
        </List.Item>
      )}
    />
  );
};
