const defaultTheme = require("tailwindcss/defaultTheme");
const colors = require("tailwindcss/colors");

module.exports = {
  purge: ["./src/**/*.{js,jsx,ts,tsx}", "./public/index.html"],
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {
      fontFamily: {
        header: ["Source Sans Pro", ...defaultTheme.fontFamily.sans],
        body: ["Open Sans", ...defaultTheme.fontFamily.sans],
      },
      colors: {
        spotifygreen: "#FFB954",
        offblack: "#222222",
        warmgray: colors.warmGray,
      },
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
};
