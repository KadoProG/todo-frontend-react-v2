/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        border: '#ddd',
        text: '#000',
        'text-secondary': '#666',
        'bg-active': '#96E3AE',
        'bg-active-hover': '#7DC393',
        'bg-base': '#FFF',
        'bg-base-hover': '#F5F5F5',
      },
    },
  },
};
