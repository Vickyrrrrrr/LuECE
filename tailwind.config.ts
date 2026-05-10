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
        background: "#f7f4ed",
        foreground: "#1c1c1c",
        cream: {
          DEFAULT: "#f7f4ed",
          surface: "#f7f4ed",
          border: "#eceae4",
        },
        charcoal: {
          DEFAULT: "#1c1c1c",
          muted: "#5f5f5d",
          offwhite: "#fcfbf8",
        },
      },
      fontFamily: {
        sans: ["Camera Plain Variable", "Instrument Sans", "ui-sans-serif", "system-ui", "sans-serif"],
      },
      borderRadius: {
        'micro': '4px',
        'standard': '6px',
        'comfortable': '8px',
        'card': '12px',
        'container': '16px',
        'pill': '9999px',
      },
      boxShadow: {
        'inset-button': 'rgba(255,255,255,0.2) 0px 0.5px 0px 0px inset, rgba(0,0,0,0.2) 0px 0px 0px 0.5px inset, rgba(0,0,0,0.05) 0px 1px 2px 0px',
        'focus-warm': 'rgba(0,0,0,0.1) 0px 4px 12px',
      },
      letterSpacing: {
        'tight-hero': '-1.5px',
        'tight-heading': '-1.2px',
        'tight-sub': '-0.9px',
      },
    },
  },
  plugins: [],
};
export default config;
