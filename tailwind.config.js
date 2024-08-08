/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'selector',
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx,css,svelte}"],
  theme: {
    extend: {},
    color: {
      'dark':"#000000",
      'light':'#ffffff'
    }
  },

  plugins: [],
};
