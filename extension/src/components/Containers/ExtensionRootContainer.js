import React, { useEffect } from 'react';
import styled from 'styled-components';
import { observer } from 'mobx-react-lite';

import { useFileStore, useUserStore } from '../../hooks/store';

// eslint-disable-next-line import/no-named-as-default
import { backgroundColor, textColor } from '../../constants/theme';
import {
  getOpenRepositories,
  onUpdateOpenRepositories
} from '../../utils/repository';
import useDAO from '../../hooks/dao';

const Container = styled.div`
  position: fixed;
  display: flex;

  left: 0;
  top: 0;
  height: 100vh;
  width: 100vw;
  z-index: -10000;

  /* background-color: ${backgroundColor}; */
  color: ${textColor};
`;

const ExtensionRootContainer = observer(({ children }) => {
  const { openRepos, setOpenRepos } = useFileStore();
  const { isLoggedIn } = useUserStore();
  const dao = useDAO();

  // App wide listeners are initialized here.
  // On Open repositories update setOpenRepos
  useEffect(() => {
    const removeListener = onUpdateOpenRepositories((repoList) => {
      setOpenRepos(repoList);
    });
    return removeListener;
  }, []);

  // Get all open repositories on startup
  useEffect(() => {
    if (openRepos.size === 0) {
      getOpenRepositories((repoList) => {
        setOpenRepos(repoList);
      });
    }
  }, [openRepos]);

  // Get all bookmarks on startup
  useEffect(() => {
    if (dao && isLoggedIn) {
      dao.getAllBookmarks();
    }
  }, [dao, isLoggedIn]);

  return <Container>{children}</Container>;
});

export default ExtensionRootContainer;
