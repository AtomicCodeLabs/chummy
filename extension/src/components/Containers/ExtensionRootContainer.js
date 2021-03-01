import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { observer } from 'mobx-react-lite';

import { useFileStore, useUserStore } from '../../hooks/store';
import { backgroundColor, textColor } from '../../constants/theme';
import {
  getOpenRepositories,
  onUpdateOpenRepositories
} from '../../utils/repository';
import { onUserUpdate } from '../../utils/user';
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
  // Keep a hold of user update in case dao is not initialized by the time the update comes through
  const [userUpdateReq, setUserUpdateReq] = useState();
  const dao = useDAO();

  // App wide listeners are initialized here.
  // On Open repositories update setOpenRepos
  useEffect(() => {
    const removeListener = onUpdateOpenRepositories(
      ({ isAdding, openRepositories }) => {
        setOpenRepos(openRepositories, isAdding);
      }
    );
    return removeListener;
  }, []);

  // Get all open repositories on startup
  useEffect(() => {
    if (openRepos.size === 0) {
      getOpenRepositories(({ isAdding, openRepositories }) => {
        setOpenRepos(openRepositories, isAdding);
      });
    }
  }, [openRepos]);

  // Get all bookmarks on startup
  useEffect(() => {
    if (dao && isLoggedIn) {
      dao.getAllBookmarks();
    }
  }, [dao, isLoggedIn]);

  // Get user subscription updates
  useEffect(() => {
    const removeListener = onUserUpdate((req) => {
      setUserUpdateReq(req);
    });
    return removeListener;
  }, []);
  useEffect(() => {
    if (dao && userUpdateReq) {
      dao.updateUser(userUpdateReq);
    }
  }, [dao, userUpdateReq]);

  return <Container>{children}</Container>;
});

export default ExtensionRootContainer;
