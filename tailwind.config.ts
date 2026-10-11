import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        switch: {
          teal: {
            DEFAULT: "#0C4A60",
            50: "#F0F7FA",
            100: "#D9ECF3",
            200: "#B3D9E7",
            300: "#80BCDB",
            400: "#4D9FCF",
            500: "#1A7BAE",
            600: "#0C4A60",
            700: "#093849",
            800: "#062633",
            900: "#03141C",
          },
          orange: {
            DEFAULT: "#FF5E14",
            50: "#FFF6F0",
            100: "#FFE9DC",
            200: "#FFD0B8",
            300: "#FFAF88",
            400: "#FF874E",
            500: "#FF5E14",
            600: "#E04804",
            700: "#B83600",
            800: "#8C2A00",
            900: "#5E1D00",
          },
          dark: "#071E26",
          navy: "#0A192F",
          bg: "#F8FAFC",
        },
      },
      fontFamily: {
        sans: ["var(--font-inter)", "sans-serif"],
      },
    },
  },
  plugins: [],
};
export default config;
