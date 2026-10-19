/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        cream: {
          50: '#FDFBF7',
          100: '#FAF6F0',
          200: '#F3ECE1',
          300: '#E7DEC9',
          400: '#D5C5AC',
        },
        forest: {
          50: '#F2F7F4',
          100: '#DFECE4',
          200: '#BCD3C5',
          600: '#2F543E',
          700: '#234130',
          800: '#1A3023',
          900: '#122219',
        },
        olive: {
          100: '#EFF2EA',
          500: '#6E7F5A',
          600: '#566645',
          700: '#404E32',
        },
        espresso: {
          50: '#F7F4F2',
          100: '#EBE4E0',
          200: '#DACBC3',
          400: '#9E7E70',
          600: '#694D41',
          700: '#4D362C',
          800: '#34231B',
          900: '#201510',
          950: '#140C09',
        },
        ember: {
          50: '#FDF7F2',
          100: '#FBECE1',
          200: '#F5D3BC',
          500: '#C86D3B',
          600: '#B05627',
          700: '#8E4018',
        },
        sand: {
          100: '#F2ECE4',
          200: '#E5DCD0',
          300: '#D5C7B5',
        }
      },
      fontFamily: {
        serif: ['"Playfair Display"', 'Georgia', 'Cambria', 'serif'],
        sans: ['"Plus Jakarta Sans"', 'Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'subtle': '0 2px 10px rgba(32, 21, 16, 0.04)',
        'card': '0 10px 30px -5px rgba(32, 21, 16, 0.06), 0 4px 6px -2px rgba(32, 21, 16, 0.02)',
        'modal': '0 25px 50px -12px rgba(20, 12, 9, 0.25)',
      }
    },
  },
  plugins: [],
};
