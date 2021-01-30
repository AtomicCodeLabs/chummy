import React from 'react';
import { observer } from 'mobx-react-lite';

import { toJS } from 'mobx';
import { checkCurrentUser } from '../../hooks/dao';
import { useUiStore } from '../../hooks/store';
import Panel from '../../components/Panel';
import { PanelDivider2, PanelsContainer } from '../../components/Panel/style';
import { FormResultsDescriptionContainer } from '../../components/Form/index';
import Scrollbars from '../../components/Scrollbars';
import {
  contrastTextColor,
  notificationTypeToColor
} from '../../constants/theme';

export default observer(() => {
  checkCurrentUser();
  const { notifications, removeNotification } = useUiStore();
  const hasNotifications = !!(!notifications || notifications.size);

  console.log('notifications', toJS(notifications));

  return (
    <Scrollbars>
      <FormResultsDescriptionContainer>
        {hasNotifications ? notifications.size : 0} notifications
      </FormResultsDescriptionContainer>
      {hasNotifications && (
        <PanelsContainer>
          {Array.from(notifications).map(([, notification]) => (
            <React.Fragment key={notification.id}>
              <Panel
                title={notification.title}
                description={notification.message}
                backgroundColor={notificationTypeToColor[notification.type]}
                titlefontColor={contrastTextColor}
                descriptionFontColor={contrastTextColor}
                borderRadius="3px"
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
