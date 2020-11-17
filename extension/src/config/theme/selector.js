import { kebabify, objectMap } from '../../utils';
import * as themes from './themes';

const THEMES = objectMap(
  themes,
  (k, v) => v.name,
  (v) => v.theme
);

export const THEME_NAMES = Object.keys(THEMES);

// Returns a object with key-value for each theme and property
// [themeName]: [propertyValue]
const getThemesForProperty = (key) => {
  return objectMap(
    THEMES,
    (k) => kebabify(k),
    (v) => v[key]
  );
};

export default getThemesForProperty;
