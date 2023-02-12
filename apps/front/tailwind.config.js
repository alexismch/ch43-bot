const { createGlobPatternsForDependencies } = require('@nrwl/react/tailwind');
const { join } = require('path');

/** @type {import('tailwindcss').Config} */
module.exports = {
   content: [
      join(
         __dirname,
         '{app,pages,components}/**/*!(*.stories|*.spec).{ts,tsx,html}',
      ),
      ...createGlobPatternsForDependencies(__dirname),
   ],
   theme: {
      extend: {
         colors: {
            light: {
               white: '#F6F6F6',
               black: '#181818',
               'light-grey': '#575757',
               grey: '#2E2E2E',
               'dark-grey': '#232323',
               primary: '#006f91',
               secondary: '#b25602',
               purple: '#84019a',
               red: '#a90120',
               green: '#01a167',
            },
            dark: {
               white: '#F6F6F6',
               black: '#181818',
               'light-grey': '#575757',
               grey: '#2E2E2E',
               'dark-grey': '#232323',
               primary: '#6CCAFF',
               secondary: '#FFAA5C',
               purple: '#F2A5FF',
               red: '#F35673',
               green: '#00FEA3',
            },
         },
      },
   },
   plugins: [],
};
