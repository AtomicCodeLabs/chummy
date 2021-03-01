/* eslint-disable global-require */
const defaultTheme = require('tailwindcss/defaultTheme');

module.exports = {
  purge: {
    enabled: process.env.NODE_ENV === 'production',
    content: ['./src/**/*.{js,jsx,ts,tsx,html}', 'public/**/*.html']
  },
  darkMode: false, // or 'media' or 'class'
  theme: {
    screens: {
      '2xl': { max: '1535px' },
      xl: { max: '1279px' },
      lg: { max: '1023px' },
      'md-lg': { max: '940px' }, // used for navbar
      'md-1-lg': { max: '830px' }, // used for navbar
      md: { max: '777px' },
      sm: { max: '640px' },
      xs: { max: '550px' }
    },
    fontSize: {
      ...defaultTheme.fontSize,
      '3xs': ['.7rem', '0.95rem'],
      xxs: ['.75rem', '1rem'],
      xs: ['.8rem', '1rem'],
      sm: ['.9rem', '1.25rem'],
      base: ['1rem', '1.5rem']
    },
    fontFamily: {
      sans: ['Inter', ...defaultTheme.fontFamily.sans],
      mono: ['JetBrains Mono', ...defaultTheme.fontFamily.mono]
    },
    boxShadow: {
      ...defaultTheme.boxShadow,
      'xl-center':
        '0 0px 25px 10px rgba(0, 0, 0, 0.1), 0 0px 10px 10px rgba(0, 0, 0, 0.04)',
      '2xl-center': '0 0px 50px -12px rgba(0, 0, 0, 0.25)'
    },
    borderRadius: {
      ...defaultTheme.borderRadius,
      xl: '0.9rem'
    },
    extend: {
      height: () => ({
        150: '30rem'
      }),
      margin: {
        full: '100%'
      }
    }
  },
  variants: {
    extend: {
      inset: ['hover'],
      borderWidth: ['hover'],
      translate: ['hover'],
      ringWidth: ['hover'],
      ringColor: ['hover'],
      padding: ['last']
    }
  },
  plugins: []
};
