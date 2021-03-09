import React from 'react';
import { useHistory } from 'react-router-dom';
import { observer } from 'mobx-react-lite';
import { PersonIcon, LinkExternalIcon } from '@primer/octicons-react';

import Panel from '../../components/Panel';
import { PanelsContainer, PanelDivider } from '../../components/Panel/style';
import CircleImage from '../../components/Image/CircleImage';
import { A, H2 } from '../../components/Text';
import Scrollbars from '../../components/Scrollbars';
import TextButton from '../../components/Buttons/TextButton';
import useDAO, { checkCurrentUser } from '../../hooks/dao';
import { useUserStore } from '../../hooks/store';
import useTheme from '../../hooks/useTheme';
import { capitalize } from '../../utils';
import { redirectToUrl } from '../../utils/browser';
import { ICON } from '../../constants/sizes';
import { APP_URLS } from '../../global/constants';

export default observer(() => {
  checkCurrentUser();
  const history = useHistory();
  const dao = useDAO();
  const { user } = useUserStore();
  const { spacing } = useTheme();
  const STPayload = { theme: { spacing } };

  const canUpgrade =
    !['professional', 'enterprise'].includes(user?.accountType) ||
    user?.isTrial === 'true';

  const redirectTo = (base, route) => {
    redirectToUrl(new URL(route, base).toString());
  };

  return (
    <Scrollbars>
      <PanelsContainer>
        <Panel
          evenPadding
          center
          onClick={() => {
            redirectTo(APP_URLS.WEBSITE.BASE, APP_URLS.WEBSITE.ACCOUNT);
          }}
        >
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
        <Panel
          title="Email"
          description={user.email}
          onClick={() => {
            redirectTo(APP_URLS.WEBSITE.BASE, APP_URLS.WEBSITE.ACCOUNT);
          }}
        />
        <PanelDivider />
        <Panel
          title="Edition"
          description={
            user?.accountType
              ? `${capitalize(user?.accountType)}${
                  user?.isTrial ? ' (Trial)' : ''
                }`
              : null
          }
          onClick={() => {
            redirectTo(
              APP_URLS.WEBSITE.BASE,
              canUpgrade ? APP_URLS.WEBSITE.CHECKOUT : APP_URLS.WEBSITE.ACCOUNT
            );
          }}
          rightPanel={<A>{canUpgrade ? 'Upgrade' : null}</A>}
        />
        <PanelDivider />
        <Panel
          title="Feedback"
          description="Enjoying the app? Found a bug? Need a feature?"
          center
          onClick={() => {
            redirectTo(APP_URLS.WEBSITE.BASE, APP_URLS.WEBSITE.FEEDBACK);
          }}
          rightPanel={<LinkExternalIcon size={ICON.SIZE(STPayload)} />}
        />
        <PanelDivider />
        {/* <Panel
          title="Share the love!"
          description="If one of your Github Chummies"
          center
          onClick={() => {
            redirectToUrl(GITHUB_URLS.FEEDBACK);
          }}
          rightPanel={<ShareIcon size={ICON.SIZE(STPayload)} />}
        /> */}
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
