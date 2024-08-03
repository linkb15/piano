const { parkwindPlugin } = require('@park-ui/tailwind-plugin')

/** @type {import('tailwindcss').Config} */
export default {
  plugins: [parkwindPlugin],
  darkMode: ['class'],
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      container: {
        center: true,
        padding: '1rem',
      },

      backgroundImage: {
        'gradient-blue':
          'linear-gradient(146.92deg, #02D5FF 12.19%, #0092AF 93.16%)',
        'gradient-pink':
          'linear-gradient(146.92deg, #E099FF 12.19%, #C84BFF 93.16%)',
        'gradient-turquoise':
          'linear-gradient(146.92deg, #0BFFDD 12.19%, #11A28D 93.16%)',
        'gradient-yellow-green':
          'linear-gradient(146.92deg, #E3FF93 12.19%, #C3FF18 93.16%)',
        'gradient-text':
          'linear-gradient(90deg, #02D5FF 18.81%, #C84CFF 78.14%)',
        'gradient-white':
          'linear-gradient(180deg, #E4E4E4 0.95%, #FFFFFF 97.37%)',
        'gradient-black':
          'linear-gradient(165.19deg, #232A3D 0.7%, #323A56 84.98%)',
      },
    },
  },
  // parkUI: {
  //   accentColor: 'neutral',
  //   grayColor: 'sage',
  //   borderRadius: '2xl',
  // },
}
