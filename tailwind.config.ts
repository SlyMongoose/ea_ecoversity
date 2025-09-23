import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Hawaiian-inspired color palette
        ocean: {
          50: '#e6f7ff',
          100: '#bae7ff',
          200: '#91d5ff',
          300: '#69c0ff',
          400: '#40a9ff',
          500: '#1890ff',
          600: '#096dd9',
          700: '#0050b3',
          800: '#003a8c',
          900: '#002766',
        },
        coral: {
          50: '#fff2e8',
          100: '#ffd8bf',
          200: '#ffb895',
          300: '#ff9c6e',
          400: '#ff7a45',
          500: '#ff4d1a',
          600: '#e73c00',
          700: '#b22f00',
          800: '#7d2100',
          900: '#541600',
        },
        lava: {
          50: '#fdf2f2',
          100: '#fde8e8',
          200: '#fbd5d5',
          300: '#f8b4b4',
          400: '#f98080',
          500: '#f05252',
          600: '#e02424',
          700: '#c53030',
          800: '#9b1c1c',
          900: '#771d1d',
        },
        forest: {
          50: '#f0f9f0',
          100: '#dcf2dc',
          200: '#c3e6c3',
          300: '#9dd49d',
          400: '#68bd68',
          500: '#38a138',
          600: '#2d8a2d',
          700: '#257025',
          800: '#1f5a1f',
          900: '#1a4a1a',
        },
        sand: {
          50: '#fefaf7',
          100: '#fdf4ee',
          200: '#fbe8d6',
          300: '#f7d6ba',
          400: '#f1b896',
          500: '#e9956c',
          600: '#d97444',
          700: '#c2582a',
          800: '#a04621',
          900: '#84391c',
        },
        sky: {
          50: '#f0f9ff',
          100: '#e0f2fe',
          200: '#bae6fd',
          300: '#7dd3fc',
          400: '#38bdf8',
          500: '#0ea5e9',
          600: '#0284c7',
          700: '#0369a1',
          800: '#075985',
          900: '#0c4a6e',
        },
      },
      fontFamily: {
        'hawaiian': ['Inter', 'system-ui', 'sans-serif'],
        'serif': ['Georgia', 'serif'],
      },
      fontSize: {
        'xs': '0.75rem',
        'sm': '0.875rem',
        'base': '1rem',
        'lg': '1.125rem',
        'xl': '1.25rem',
        '2xl': '1.5rem',
        '3xl': '1.875rem',
        '4xl': '2.25rem',
        '5xl': '3rem',
        '6xl': '3.75rem',
        '7xl': '4.5rem',
        '8xl': '6rem',
        '9xl': '8rem',
      },
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
        '128': '32rem',
      },
      borderRadius: {
        'xl': '1rem',
        '2xl': '1.5rem',
        '3xl': '2rem',
      },
      boxShadow: {
        'cultural': '0 4px 14px 0 rgba(26, 74, 26, 0.25)',
        'ocean': '0 4px 14px 0 rgba(24, 144, 255, 0.25)',
        'soft': '0 2px 8px 0 rgba(0, 0, 0, 0.1)',
      },
      animation: {
        'wave': 'wave 2s ease-in-out infinite alternate',
        'float': 'float 3s ease-in-out infinite',
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.5s ease-out',
      },
      keyframes: {
        wave: {
          '0%': { transform: 'rotate(0deg)' },
          '100%': { transform: 'rotate(3deg)' }
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-6px)' }
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' }
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0px)', opacity: '1' }
        }
      },
    },
  },
  plugins: [],
};

export default config;