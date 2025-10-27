import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./utils/**/*.{js,ts,jsx,tsx,mdx}",
    "./sections/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      keyframes: {
        slide: {
          '0%': { transform: 'translateX(100%)' },
          '50%': { transform: 'translateX(0%)' },
          '100%': { transform: 'translateX(-100%)' },
        },
      },
      animation: {
        slide: 'slide 10s linear infinite',
      },

      colors: {
        primary: "#19192C",
        headingColor: "#C1001F",
        textColor: "#413D45",
        customGray: "#3D3D3C",
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
      fontFamily: {
        inter: ["var(--font-inter)", "sans-serif"],
        antipasto: ["Antipasto Pro Medium", "sans-serif"],
        poppins: ["var(--font-poppins)", "sans-serif"],
      },
    },
    screens: {
      xl: "1450px",
      lg: "1024px",
      tablet: "916px",
      md: "760px",
      sm: "640px",
      xsm: "550px",
    },
  },
  plugins: [require("flowbite/plugin")],
};
export default config;
