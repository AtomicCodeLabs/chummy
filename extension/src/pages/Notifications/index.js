import React from 'react';
import { observer } from 'mobx-react-lite';

import { checkCurrentUser } from '../../hooks/dao';
import { useUiStore } from '../../hooks/store';
import Panel from '../../components/Panel';
import {
  PanelDivider2,
  PanelsContainer,
  PanelDescriptionContainer
} from '../../components/Panel/style';
import { A } from '../../components/Text';
import Scrollbars from '../../components/Scrollbars';
import { notificationTypeToColor } from '../../constants/theme';

export default observer(() => {
  checkCurrentUser();
  const {
    notifications,
    removeNotification,
    clearNotifications
  } = useUiStore();
  const hasNotifications = !!(!notifications || notifications.size);

  return (
    <Scrollbars>
      <PanelDescriptionContainer>
        <div>{hasNotifications ? notifications.size : 0} notifications</div>
        {hasNotifications && (
          <>
            <div className="spacer" />
            <div>
              <A onClick={clearNotifications}>Clear all</A>
            </div>
          </>
        )}
      </PanelDescriptionContainer>
      {hasNotifications && (
        <PanelsContainer>
          {Array.from(notifications)
            .reverse()
            .map(([, notification]) => (
              <React.Fragment key={notification.id}>
                <Panel
                  title={notification.title}
                  description={notification.message}
                  borderLeftColor={notificationTypeToColor[notification.type]}
                  onClick={() => {
                    removeNotification(notification);
                  }}
                />
                <PanelDivider2 />
              </React.Fragment>
            ))}
        </PanelsContainer>
      )}
    </Scrollbars>
  );
});
