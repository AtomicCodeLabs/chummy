import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { observer } from 'mobx-react-lite';

import Toast from './Toast';
import { useUiStore } from '../../hooks/store';

const Container = styled.div`
  position: absolute;
  bottom: 0;
  display: flex;
  flex-direction: column-reverse;
  width: 100%;
`;

const ToastContainer = observer(() => {
  const { pendingNotifications, popPendingNotifications } = useUiStore();
  const [localNotifications, setLocalNotifications] = useState([]);

  const removeNotification = (notification) => {
    setLocalNotifications((prevNs) =>
      prevNs.filter((n) => n.id !== notification.id)
    );
  };

  const addNotification = (notification) => {
    setLocalNotifications((prevNs) => [...prevNs, notification]);

    // set a timeout to remove each notification
    setTimeout(() => {
      removeNotification(notification);
    }, 3000);
  };

  // Drain pendingNotifications by creating a notification for each one
  useEffect(() => {
    if (pendingNotifications.size !== 0) {
      const notification = popPendingNotifications();
      addNotification(notification);
    }
  }, [pendingNotifications.size]);

  return (
    <Container>
      {localNotifications &&
        localNotifications.map((n) => (
          <Toast
            key={n.id}
            notification={n}
            removeNotification={removeNotification}
          />
        ))}
    </Container>
  );
});

export default ToastContainer;
