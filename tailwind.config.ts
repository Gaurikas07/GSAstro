import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './app/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './pages/**/*.{ts,tsx}'
  ],
  theme: {
    extend: {
      colors: {
        cosmos: '#0B1120',
        nebula: '#1A2238',
        gold: '#D4AF37'
      }
    }
  },
  plugins: []
};

export default config;
