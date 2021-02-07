const defaultTheme = require('tailwindcss/defaultTheme');

module.exports = {
  purge: ['./src/**/*.{js,jsx,ts,tsx}'],
  darkMode: false, // or 'media' or 'class'
  theme: {
    screens: {
      '2xl': { max: '1535px' },
      xl: { max: '1279px' },
      lg: { max: '1023px' },
      md: { max: '767px' },
      sm: { max: '640px' },
      xs: { max: '550px' }
    },
    fontSize: {
      ...defaultTheme.fontSize,
      xxs: '.75rem',
      xs: '.8rem',
      sm: '.9rem',
      base: '1rem'
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
    extend: {}
  },
  plugins: []
};
