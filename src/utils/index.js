import browser from 'webextension-polyfill';

/* eslint-disable no-unused-vars */
export const sortFiles = (a, b) => {
  // Sort by file type
  if (a.type === 'tree' && b.type === 'blob') return -1;
  if (a.type === 'blob' && b.type === 'tree') return 1;
  // Sort by name
  if (a.name > b.name) return 1;
  if (a.name < b.name) return -1;
  return 1;
};

// https://stackoverflow.com/questions/14810506/map-function-for-objects-instead-of-arrays
export const objectMap = (
  obj,
  fnKey = (k, _v, _i) => k,
  fnValue = (v, _k, _i) => v
) =>
  Object.fromEntries(
    Object.entries(obj).map(([k, v], i) => [fnKey(k, v, i), fnValue(v, k, i)])
  );

export const isBlank = (o) => {
  if (!o) return true;
  if (o.constructor === Object) {
    return Object.entries(o).length === 0;
  }
  if (o.constructor === String) {
    return !o || o.trim().length === 0;
  }
  return false;
};

export const redirectToUrl = (url) => {
  browser.runtime.sendMessage({
    action: 'redirect-to-url',
    payload: { url }
  });
};

// https://stackoverflow.com/questions/1983648/replace-spaces-with-dashes-and-make-all-letters-lower-case
export const kebabify = (s) => s.replace(/\s+/g, '-').toLowerCase();
