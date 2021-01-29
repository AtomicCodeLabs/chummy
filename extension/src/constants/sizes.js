/**
 * Global Sizes
 */
import theme from 'styled-theming';

export const EXTENSION_WIDTH = {
  INITIAL: 350,
  MIN: 150,
  MAX: 500
};

/**
 * Sidebar Sizes
 */

export const SIDE_TAB = {
  WIDTH: 50,
  BUTTON: { HEIGHT: 55, HIGHLIGHT_WIDTH: 3 }
};

export const HEADER = {
  HEIGHT: 40
};

export const NODE = {
  HEIGHT: theme('spacing', {
    compact: 19,
    cozy: 25,
    comfortable: 30
  })
};

export const ICON = {
  SIZE: theme('spacing', {
    compact: 14,
    cozy: 16,
    comfortable: 18
  }),
  SIDE_MARGIN: theme('spacing', {
    compact: 3,
    cozy: 4,
    comfortable: 5
  }),
  PROFILE_IMAGE: {
    SIZE: theme('spacing', {
      compact: 150,
      cozy: 160,
      comfortable: 170
    })
  },
  SPLASH: {
    SIZE: theme('spacing', {
      compact: 115,
      cozy: 120,
      comfortable: 128
    })
  }
};

export const INPUT = {
  SELECT: {
    HEIGHT: theme('spacing', {
      compact: 28,
      cozy: 32,
      comfortable: 35
    }),
    OPTION: {
      HEIGHT: theme('spacing', {
        compact: 18,
        cozy: 21,
        comfortable: 24
      })
    }
  }
};

export const BUTTON = {
  HEIGHT: theme('spacing', {
    compact: 30,
    cozy: 35,
    comfortable: 40
  }),
  BIG_HEIGHT: theme('spacing', {
    compact: 40,
    cozy: 45,
    comfortable: 50
  }),
  SIDE_PADDING: theme('spacing', {
    compact: 10,
    cozy: 15,
    comfortable: 20
  })
};

export const RESIZE_GUTTER = {
  HEIGHT: 5
};

export const TAB_HEIGHT = 50;

/**
 * Tabbar Sizes
 */

export const TOP_TAB = {
  HEIGHT: 50
};
