/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html", "./src/**/*.{ts,js}"],
  theme: {
    extend: {
      colors: {
        emerald: {
          950: "#0E241C",
          900: "#123328",
          700: "#1E5340",
          600: "#2C6E56",
        },
        gold: {
          DEFAULT: "#C69A2E",
          light: "#E7C871",
        },
        cream: "#FBF7EC",
        parchment: "#F3EDDD",
        ink: {
          DEFAULT: "#161F1A",
          soft: "#48564D",
        },
        line: "#E3DAC0",
        error: "#B4453B",
      },
      fontFamily: {
        heading: ['"Lora"', "serif"],
        sans: ['"Plus Jakarta Sans"', "sans-serif"],
      },
      borderRadius: {
        card: "20px",
      },
    },
  },
  plugins: [],
};
