/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html", "./src/**/*.{ts,js}"],
  theme: {
    extend: {
      colors: {
        forest: { DEFAULT: "#1b4332", light: "#2d6a4f", deep: "#122c21" },
        gold: { DEFAULT: "#d4af6a", light: "#e6c98f", dark: "#8a6a2b" },
        cream: "#faf8f4",
        ink: { DEFAULT: "#1a1a1a", soft: "#505a53" },
        line: "#ddd6c6",
        error: "#b4453b",
      },
      fontFamily: {
        heading: ['"Plus Jakarta Sans"', "sans-serif"],
        sans: ["Inter", "sans-serif"],
        arabic: ["Amiri", "serif"],
      },
      borderRadius: { card: "6px" },
    },
  },
  plugins: [],
};
