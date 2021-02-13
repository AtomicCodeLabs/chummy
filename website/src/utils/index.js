// eslint-disable-next-line import/prefer-default-export
export const matchRoutes = (a, b) =>
  a.replace(/\//g, '') === b.replace(/\//g, '');
