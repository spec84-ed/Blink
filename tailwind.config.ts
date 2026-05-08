import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}"
  ],
  theme: {
    extend: {
      colors: {
        ink: "#17201b",
        field: "#f7f8f3",
        moss: "#5c7d5a",
        lime: "#d9f26f",
        coral: "#ff7c66",
        sky: "#72b7d2",
        oat: "#f2eadc"
      },
      boxShadow: {
        soft: "0 18px 60px rgba(23, 32, 27, 0.12)",
        card: "0 10px 30px rgba(23, 32, 27, 0.08)"
      },
      fontFamily: {
        sans: ["Inter", "ui-sans-serif", "system-ui", "sans-serif"]
      }
    }
  },
  plugins: []
};

export default config;
