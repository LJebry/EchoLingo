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
        pulse: "rgb(var(--color-pulse) / <alpha-value>)",
        "on-pulse": "rgb(var(--color-on-pulse) / <alpha-value>)",
        support: "rgb(var(--color-support) / <alpha-value>)",
        "on-support": "rgb(var(--color-on-support) / <alpha-value>)",
        accent: "rgb(var(--color-accent) / <alpha-value>)",
        "on-accent": "rgb(var(--color-on-accent) / <alpha-value>)",
        surface: "rgb(var(--color-surface) / <alpha-value>)",
        "surface-low": "rgb(var(--color-surface-low) / <alpha-value>)",
        "surface-high": "rgb(var(--color-surface-high) / <alpha-value>)",
        "surface-highest": "rgb(var(--color-surface-highest) / <alpha-value>)",
        "surface-bright": "rgb(var(--color-surface-bright) / <alpha-value>)",
        "on-surface": "rgb(var(--color-on-surface) / <alpha-value>)",
        "outline-ghost": "rgb(var(--color-outline-ghost) / <alpha-value>)",
        "pulse-container": "rgb(var(--color-pulse-container) / <alpha-value>)",
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
