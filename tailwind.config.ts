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
        navy: {
          950: "#060913",
          900: "#0B1120",
          850: "#0F172A",
          800: "#1E293B",
          700: "#334155",
        },
        violet: {
          DEFAULT: "#8B5CF6",
          500: "#8B5CF6",
          600: "#7C3AED",
          700: "#6D28D9",
          400: "#A78BFA",
        },
        cyan: {
          DEFAULT: "#06B6D4",
          400: "#22D3EE",
          500: "#06B6D4",
          300: "#67E8F9",
        },
        surface: {
          card: "#131C31",
          elevated: "#18233C",
          border: "#253352",
        }
      },
    },
  },
  plugins: [],
};
export default config;
