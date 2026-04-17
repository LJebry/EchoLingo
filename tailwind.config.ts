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
        pulse: "#d0bcff",
        "on-pulse": "#3c0091",
        support: "#b9c7df",
        "on-support": "#233144",
        accent: "#8bd6b4",
        "on-accent": "#003827",
        surface: "#0b1326",
        "surface-low": "#131b2e",
        "surface-high": "#222a3d",
        "surface-highest": "#2d3449",
        "surface-bright": "#394563",
        "on-surface": "#dae2fd",
        "outline-ghost": "rgba(218, 226, 253, 0.2)",
        "pulse-container": "#7a5ac9",
      },
      fontFamily: {
        sans: ["Inter", "ui-sans-serif", "system-ui", "sans-serif"],
        display: ["Manrope", "Inter", "ui-sans-serif", "system-ui", "sans-serif"],
      },
      boxShadow: {
        ambient: "0 20px 32px rgba(9, 15, 30, 0.32)",
        glow: "0 10px 40px rgba(208, 188, 255, 0.2)",
      },
      keyframes: {
        "fade-up": {
          "0%": { opacity: "0", transform: "translateY(16px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "wave-bar": {
          "0%, 100%": { transform: "scaleY(0.4)" },
          "50%": { transform: "scaleY(1)" },
        },
      },
      animation: {
        "fade-up": "fade-up 0.7s ease-out both",
        "wave-bar": "wave-bar 1.1s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};

export default config;
