import { useContext } from 'react';
import { toJS } from 'mobx';
import RootStoreContext from '../config/store/context.ts';

export const useStores = () => {
  return useContext(RootStoreContext);
};

export const useUserStore = () => {
  const { userStore } = useStores();
  return userStore;
};

export const useFileStore = () => {
  const { fileStore } = useStores();
  return fileStore;
};

export const useUiStore = () => {
  const { uiStore } = useStores();
  return uiStore;
};
