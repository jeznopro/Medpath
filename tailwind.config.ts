import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        paper: {
          DEFAULT: "#F3EFE6",
          50: "#FAF7F2",
          100: "#F3EFE6",
          200: "#E9E3D5",
          300: "#DDD7CC",
          border: "#DDD7CC",
          card: "#FBF9F4",
          subtle: "#ECE6D8",
        },
        burgundy: {
          DEFAULT: "#782F3B",
          50: "#F9ECEE",
          100: "#F4D9DC",
          200: "#E8B4BB",
          300: "#D38893",
          600: "#782F3B",
          700: "#642530",
          800: "#511D26",
          900: "#3E151D",
        },
        charcoal: {
          DEFAULT: "#30312F",
          50: "#9C9B97",
          100: "#77756F",
          200: "#565551",
          300: "#41413E",
          DEFAULT_MAIN: "#30312F",
          sub: "#77756F",
          muted: "#8C8A83",
        },
        pine: {
          DEFAULT: "#34745B",
          50: "#EDF6F2",
          100: "#DBEDE4",
          600: "#34745B",
          700: "#295C48",
          800: "#1E4435",
        },
        amber: {
          DEFAULT: "#B67A36",
          50: "#FBF5EB",
          100: "#F6EAD5",
          600: "#B67A36",
          700: "#936128",
          800: "#70481B",
        },
      },
      fontFamily: {
        serif: ["Newsreader", "Source Serif 4", "Playfair Display", "Georgia", "serif"],
        sans: ["Inter", "-apple-system", "BlinkMacSystemFont", "Segoe UI", "Roboto", "sans-serif"],
      },
      boxShadow: {
        editorial: "0 1px 3px 0 rgba(48, 49, 47, 0.04), 0 1px 2px -1px rgba(48, 49, 47, 0.04)",
        "editorial-md": "0 4px 12px -2px rgba(48, 49, 47, 0.06), 0 2px 6px -2px rgba(48, 49, 47, 0.04)",
        "editorial-lg": "0 10px 24px -4px rgba(48, 49, 47, 0.08), 0 4px 8px -3px rgba(48, 49, 47, 0.04)",
      },
    },
  },
  plugins: [],
};
export default config;

