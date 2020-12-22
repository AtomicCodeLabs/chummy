export const isBrowser = () => typeof window !== 'undefined';

export const getUser = () =>
  isBrowser() && window.localStorage.getItem('user')
    ? JSON.parse(window.localStorage.getItem('user'))
    : {};

export const setUser = (user) =>
  isBrowser() && window.localStorage.setItem('user', JSON.stringify(user));

export const isLoggedIn = () => {
  const user = getUser();
  return !!user.email;
};

export const logout = (firebase) => {
  return new Promise((resolve) => {
    firebase
      .auth()
      .signOut()
      .then(() => {
        setUser({});
        resolve();
      });
  });
};
