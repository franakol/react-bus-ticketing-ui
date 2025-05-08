/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#3B82F6',
        secondary: '#10B981',
        accent: '#8B5CF6',
        dark: '#1E293B',
        darker: '#0F172A',
        light: '#F1F5F9',
      },
    },
  },
  plugins: [],
  darkMode: 'class',
}
