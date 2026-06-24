/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./app/**/*.{js,ts,jsx,tsx}', './components/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: { cream: '#f6f3ed', ink: '#1c1c1a', sand: '#ded7ca' },
      fontFamily: { sans: ['Arial', 'Helvetica', 'sans-serif'] }
    }
  },
  plugins: []
};
