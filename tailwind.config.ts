import type { Config } from 'tailwindcss'

export default {
  content: [
    './app/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        accent: {
          DEFAULT: '#5b9aff',
          soft: '#e9f1ff',
        },
        oj: {
          DEFAULT: '#ff8a00',
          soft: '#fff3e6',
        }
      },
      boxShadow: {
        soft: '0 2px 12px rgba(0,0,0,0.06)'
      },
      backdropBlur: {
        xs: '2px'
      }
    },
  },
  darkMode: 'class',
  plugins: [],
} satisfies Config

