import { toJS } from 'mobx';
import { ThrottlingError, UserError, WindowError } from '../global/errors';

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

// https://stackoverflow.com/questions/1983648/replace-spaces-with-dashes-and-make-all-letters-lower-case
export const kebabify = (s) => s.replace(/\s+/g, '-').toLowerCase();

// https://flaviocopes.com/how-to-uppercase-first-letter-javascript/
export const capitalize = (s) => s.charAt(0).toUpperCase() + s.slice(1);

export const areArraysEqual = (a, b) =>
  a.length === b.length && a.every((ai, i) => ai === b[i]);

export const isProduction = () => {
  return process.env.NODE_ENV === 'production';
};

export const handleResponse = (response) => {
  if (response.error) {
    // Figure out what error it is
    const e = response.error;
    if (e.name === 'ThrottlingError') {
      throw ThrottlingError.from(e);
    }
    if (e.name === 'UserError') {
      throw UserError.from(e);
    }
    if (e.name === 'WindowError') {
      throw WindowError.from(e);
    }
    // If not defined, throw as generic Error
    const genericE = new Error(e.message);
    genericE.stack = e.stack;
    throw genericE;
  }
  // return response
  return response;
};

export const unproxifyBookmark = (bookmark) => {
  return {
    ...bookmark,
    branch: toJS(bookmark.branch),
    repo: toJS(bookmark.repo)
  };
};
