// eslint-disable-next-line import/prefer-default-export
export const matchRoutes = (a, b) =>
  a.replace(/\//g, '') === b.replace(/\//g, '');

export const capitalize = (s) => {
  if (typeof s !== 'string') return null;
  return s.charAt(0).toUpperCase() + s.slice(1);
};
