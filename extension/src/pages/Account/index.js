import React from 'react';
import { useHistory } from 'react-router-dom';
import { observer } from 'mobx-react-lite';
import {
  PersonIcon,
  LinkExternalIcon,
  ShareIcon
} from '@primer/octicons-react';

import Panel from '../../components/Panel';
import { PanelsContainer, PanelDivider } from '../../components/Panel/style';
import CircleImage from '../../components/Image/CircleImage';
import { H2 } from '../../components/Text';
import Scrollbars from '../../components/Scrollbars';
import TextButton from '../../components/Buttons/TextButton';
import useDAO, { checkCurrentUser } from '../../hooks/dao';
import { useUserStore } from '../../hooks/store';
import useTheme from '../../hooks/useTheme';
import { capitalize } from '../../utils';
import { redirectToUrl } from '../../utils/browser';
import { ICON } from '../../constants/sizes';
import { GITHUB_URLS } from '../../constants/urls';

export default observer(() => {
  checkCurrentUser();
  const history = useHistory();
  const dao = useDAO();
  const { user } = useUserStore();
  const { spacing } = useTheme();
  const STPayload = { theme: { spacing } };

  return (
    <Scrollbars>
      <PanelsContainer>
        <Panel evenPadding center>
          <CircleImage
            src={user.photoURL}
            size={ICON.PROFILE_IMAGE.SIZE(STPayload)}
            alt="profile-picture"
            PlaceholderIcon={<PersonIcon />}
            borderSize={1}
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
          title="Feedback + Suggestions"
          description="Enjoying the app? Found a bug? Need a feature?"
          center
          onClick={() => {
            redirectToUrl(GITHUB_URLS.FEEDBACK);
          }}
          rightPanel={<LinkExternalIcon size={ICON.SIZE(STPayload)} />}
        />
        <PanelDivider />
        <Panel
          title="Share the love!"
          description="Like what you see? Share Chummy with your Github chummies!"
          center
          onClick={() => {
            redirectToUrl(GITHUB_URLS.FEEDBACK);
          }}
          rightPanel={<ShareIcon size={ICON.SIZE(STPayload)} />}
        />
        <Panel highlightOnHover={false} center>
          <TextButton
            onClick={() => {
              dao.signOut();
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
