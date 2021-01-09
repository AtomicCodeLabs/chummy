import React from 'react';
import { useHistory } from 'react-router-dom';
import { observer } from 'mobx-react-lite';
import {
  PersonIcon,
  LinkExternalIcon,
  ShareIcon
} from '@primer/octicons-react';
import { Scrollbars } from 'react-custom-scrollbars';

import Panel from '../../components/Panel';
import { PanelsContainer, PanelDivider } from '../../components/Panel/style';
import CircleImage from '../../components/Image/CircleImage';
import { H2 } from '../../components/Text';
import useFirebaseDAO, { checkCurrentUser } from '../../hooks/firebase';
import TextButton from '../../components/Buttons/TextButton';
import { useUserStore } from '../../hooks/store';
import useTheme from '../../hooks/useTheme';
import { capitalize, redirectToUrl } from '../../utils';
import { ICON } from '../../constants/sizes';
import { GITHUB_URLS } from '../../constants/urls';

export default observer(() => {
  checkCurrentUser();
  const history = useHistory();
  const firebase = useFirebaseDAO();
  const { user } = useUserStore();
  const { spacing } = useTheme();
  const STPayload = { theme: { spacing } };

  return (
    <Scrollbars
      style={{
        width: '100%',
        height: '100%'
      }}
      autoHideTimeout={500}
      autoHide
    >
      <PanelsContainer>
        <Panel evenPadding center>
          <CircleImage
            src={user.photoURL}
            size={ICON.PROFILE_IMAGE.SIZE(STPayload)}
            alt="profile-picture"
            PlaceholderIcon={<PersonIcon />}
          />
          <H2>{user.displayName}</H2>
        </Panel>
        {/* <Panel title="Name" description={user.displayName} /> */}
        <PanelDivider />
        <Panel title="Email" description={user.email} />
        <PanelDivider />
        <Panel title="Tier" description={capitalize(user.accountType)} />
        <PanelDivider />
        <Panel
          title="Leave Feedback"
          description="Found a bug? Need a feature?"
          center
          onClick={() => {
            redirectToUrl(GITHUB_URLS.FEEDBACK);
          }}
          rightPanel={<LinkExternalIcon size={ICON.SIZE(STPayload)} />}
        />
        <PanelDivider />
        <Panel
          title="Enjoying the app?"
          description="Spread the word to the other Github enthusiasts in your life!"
          center
          onClick={() => {
            redirectToUrl(GITHUB_URLS.FEEDBACK);
          }}
          rightPanel={<ShareIcon size={ICON.SIZE(STPayload)} />}
        />
        <Panel highlightOnHover={false} center>
          <TextButton
            onClick={() => {
              firebase.signOut();
              history.push('/account-sign-in');
            }}
          >
            Sign out
          </TextButton>
        </Panel>
      </PanelsContainer>
    </Scrollbars>
  );
});
