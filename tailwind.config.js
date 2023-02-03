const { Scale } = require('@mui/icons-material');

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
    './app/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        blue: {
          nerdBlue: '#01A7C2'
        },
        primary: '#01A7C2',
        secondary: 'rgb(0, 112, 144)',
        secondary_alpha: 'rgba(0, 112, 144, .6)',
        error: '#7c1325',
        warning: '#E76F51',
        original: '#fff',
        olde: '#7c1325',
        spacey: 'rgb(0, 112, 144)',
        arcade: '#84C318',
        fancy: '#E76F51'
      },
      keyframes: {
        shutter: {
          '0%, 100%': { transform: 'translateY(-200vh)' },
          '50%': { transform: 'translateY(100vh)' }
        },
        quick_shutter: {
          '0%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(0)' },
          '100%': { transform: 'translateY(-75vh)'}
        },
        grow: {
          '0%': { transform: 'scaleY(0)', opacity: '0' },
          '100%': { transform: 'scaleY(1)', opacity: '1' }
        },
        growAll: {
          '0%': { transform: 'scale(0)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' }
        },
        arrow_bounce: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(7px)' }
        },
        arrow_slide: {
          '0%, 100%': { transform: 'translateX(0)' },
          '50%': { transform: 'translateX(7px)' }
        }
      },
      animation: {
        shutter: 'shutter 2s ease-in-out infinite',
        quick_shutter: 'quick_shutter 1s ease-in-out',
        grow: 'grow .5s linear',
        growAll: 'growAll .5s linear',
        arrow_bounce: 'arrow_bounce .5s ease-in-out infinite',
        arrow_slide: 'arrow_slide .5s ease-in-out infinite'
      },
      fontFamily: {
        original: ['ui-sans-serif', 'system-ui'],
        olde: ['olde'],
        spacey: ['spacey'],
        arcade: ['arcade'],
        fancy: ['fancy'],
      }
    },
  },
  plugins: [],
}

// const defaultTheme = require('tailwindcss/defaultTheme')
// const colors = require('tailwindcss/colors')

// THIS OBJECT SHOULD BE SIMILAR TO ./helpers/theme.js
// const themeConstants = {
//   paper: "#F9F9F9",
//   primary: {
//     main: "#fff",
//     dark: "#e5e5e5",
//   },
//   secondary: {
//     main: "#212121",
//     dark: "#3A3A3A",
//   },
//   error: {
//     main: "#b22222",
//     dark: "#8b0000",
//   },
//   fg: { main: "#fff", dark: "rgba(55, 65, 81, 1)" },
//   breakpoints: {
//     xs: "0px",
//     mb: "350px",
//     sm: "600px",
//     md: "960px",
//     lg: "1280px",
//     xl: "1920px",
//   },
// };

// module.exports = {
//  mode: "jit",
//  content: [
//     "./pages/*.{js,ts,jsx,tsx}",
//     "./Components/**/*.{js,ts,jsx,tsx}",
//     "./hoc/*.{js,ts,jsx,tsx}",
//     "./Widgets/**/*.{js,ts,jsx,tsx}",
//   ],
  //darkMode: 'media', // or 'media' or 'class'
  // theme: {
  //   colors: {...colors},
  //   extend: {
  //     colors: {
  //       paper: themeConstants.paper,
  //       primary: themeConstants.primary,
  //       secondary: themeConstants.secondary,
  //       error: themeConstants.error,
  //       fg: themeConstants.fg.main,
  //       "fg-dark": themeConstants.fg.dark,
  //     },
  //   }, 
    
    // We over ride the whole screens with breakpoints for width. The 'ha' breakpoint will help us in blocking hover animations on devices not supporting hover.
//     screens: {
//       ...defaultTheme.screens,
//       ...themeConstants.breakpoints,
//       ha: { raw: "(hover: hover)" },
//     },
//   },
//   variants: {
//     extend: {},
//   },
//   plugins: [],
// };
