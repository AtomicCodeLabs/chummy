import React from 'react';
import { useHistory } from 'react-router-dom';
import { observer } from 'mobx-react-lite';
import { PersonIcon } from '@primer/octicons-react';

import Panel from '../../components/Panel';
import { PanelsContainer, PanelDivider } from '../../components/Panel/style';
import CircleImage from '../../components/Image/CircleImage';
import { H2 } from '../../components/Text';
import useFirebaseDAO, { checkCurrentUser } from '../../hooks/firebase';
import TextButton from '../../components/Buttons/TextButton';
import { useUserStore } from '../../hooks/store';
import useTheme from '../../hooks/useTheme';
import { capitalize } from '../../utils';
import { ICON } from '../../constants/sizes';

export default observer(() => {
  checkCurrentUser();
  const history = useHistory();
  const firebase = useFirebaseDAO();
  const { user } = useUserStore();
  const { spacing } = useTheme();

  return (
    <>
      <PanelsContainer>
        <Panel evenPadding center>
          <CircleImage
            src={user.photoURL}
            size={ICON.PROFILE_IMAGE.SIZE({ theme: { spacing } })}
            alt="profile-picture"
            PlaceholderIcon={<PersonIcon />}
          />
          <H2>{user.displayName}</H2>
        </Panel>
        {/* <Panel title="Name" description={user.displayName} /> */}
        <PanelDivider />
        <Panel title="Github Email" description={user.email} />
        <PanelDivider />
        <Panel title="Tier" description={capitalize(user.accountType)} />
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
    </>
  );
});
