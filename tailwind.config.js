/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        breakfast: {
          DEFAULT: '#f97316', // Orange
          light: '#ffedd5',
          dark: '#ea580c',
        },
        lunch: {
          DEFAULT: '#3b82f6', // Blue
          light: '#dbeafe',
          dark: '#2563eb',
        },
        dinner: {
          DEFAULT: '#a855f7', // Purple
          light: '#f3e8ff',
          dark: '#9333ea',
        },
      },
    },
  },
  plugins: [],
}
