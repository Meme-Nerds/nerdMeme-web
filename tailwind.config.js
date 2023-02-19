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
          '50%': { transform: 'translateY(150vh)' }
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
        fade_in: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' }
        },
        fade_out_up: {
          '0%': { opacity: '1', transform: 'translateY(0)' },
          '100%': { opacity: '0', transform: 'translateY(-200px)' }
        },
        arrow_bounce: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(7px)' }
        },
        arrow_slide: {
          '0%, 100%': { transform: 'translateX(0)' },
          '50%': { transform: 'translateX(7px)' }
        },
        expand_display: {
          '0%': { height: '60vh' },
          '100%': { height: '80vh' }
        }
      },
      animation: {
        shutter: 'shutter 2s ease-in-out infinite',
        quick_shutter: 'quick_shutter 1s ease-in-out',
        grow: 'grow .5s linear',
        fade_in: 'fade_in .5s ease',
        fade_out_up: 'fade_out_up .5s ease',
        arrow_bounce: 'arrow_bounce .5s ease-in-out infinite',
        arrow_slide: 'arrow_slide .5s ease-in-out infinite',
        expand_display: 'expand_display 2s ease'
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
