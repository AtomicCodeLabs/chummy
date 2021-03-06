import { useContext } from 'react';
import RootStoreContext from '../config/store/context';

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
