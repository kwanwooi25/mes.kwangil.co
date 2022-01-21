module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    screens: {
      tablet: '640px',
      laptop: '1024px',
      desktop: '1280px',
      'larger-desktop': '1600px',
    },
    extend: {
      colors: {
        primary: '#213f97',
      },
      width: {
        nav: '200px',
        'search-panel': '320px',
      },
    },
  },
  plugins: [],
};
