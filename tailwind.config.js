/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    darkMode: 'class',
    extend: {
      colors: {
        border: '#ddd',
        text: '#000',
        'text-secondary': '#666',
        'bg-active': '#96E3AE',
        'bg-active-hover': '#7DC393',
        'bg-base': '#FFF',
        'bg-base-hover': '#F5F5F5',
        'bg-base-dark': '#17191C',
        'bg-base-hover-dark': '#1F2125',
        'border-dark': '#495057',
      },
      backgroundImage: {
        // スケルトンに使うグラデーション
        'skeleton-gradient': 'linear-gradient(-90deg, #e0e0e0 25%, #f0f0f0 50%, #e0e0e0 75%)',
        'skeleton-gradient-dark': 'linear-gradient(-90deg, #3a3a3a 25%, #4a4a4a 50%, #3a3a3a 75%)',
      },
      keyframes: {
        'skeleton-loading': {
          '0%': { 'background-position': '200% 0' },
          '100%': { 'background-position': '-200% 0' },
        },
      },
      animation: {
        'skeleton-loading': 'skeleton-loading 2s infinite',
      },
    },
  },
};
