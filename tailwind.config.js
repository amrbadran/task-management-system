/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        darkBg: "#121212",
        darkInput: "#1a1a1a",
        darkBorder: "#333333",
        darkCard: "#252525",
        dark: {
          bg: "#121212",
          darker: "#1a1a1a",
          card: "#252525",
        },
        light: {
          bg: "#f7f7f7",
          darker: "#e5e5e5",
          card: "#ffffff",
        },
        primary: {
          blue: "#1a73e8",
          gray: "#808080",
          green: "#4caf50",
          red: "#f44336",
          orange: "#ff9800",
        },
        text: {
          white: "#ffffff",
          light: "#dddddd",
          dark: "#333333",
        },
      },
      transitionDuration: {
        300: "300ms",
      },
      borderRadius: {
        sm: "4px",
        DEFAULT: "8px",
      },
    },
  },
  plugins: [],
};
