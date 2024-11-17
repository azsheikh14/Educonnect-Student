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
        background: "var(--background)",
        foreground: "var(--foreground)",
      },
      fontFamily: {
        'racing-sans-one': ['"Racing Sans One"', 'sans-serif'],
        'mochiy-pop-p-one': ['"Mochiy Pop P One"', 'sans-serif'],
      },
      screens: {
        'custom-md': '1000px', // This custom breakpoint will be used
        'custom-lg': '1300px',
      },
    },
  },
  plugins: [],
};
export default config;
