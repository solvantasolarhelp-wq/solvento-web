import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        sol: {
          navy:  "#1B2A4A",
          teal:  "#2BA8A0",
          gold:  "#F5B800",
          dark:  "#0E1A30",
          lt:    "#EAF4F4",
          sl:    "#D8E6EC",
          gray:  "#8A9BB0",
        },
      },
      fontFamily: {
        sans: ["var(--font-geist-sans)", "system-ui", "Arial", "sans-serif"],
      },
    },
  },
  plugins: [],
};
export default config;
