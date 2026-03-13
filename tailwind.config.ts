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
        gold: {
          50: "#fdf9ec",
          100: "#f9f0cc",
          200: "#f3df8a",
          300: "#ecc948",
          400: "#e8b91e",
          500: "#c9a84c",
          600: "#b8860b",
          700: "#926a0a",
          800: "#6b4d0c",
          900: "#4a340e",
        },
        dark: {
          50: "#f5f0e8",
          100: "#e8dfc8",
          200: "#c8b898",
          300: "#a89068",
          400: "#786040",
          500: "#2a2018",
          600: "#1e1610",
          700: "#160f0a",
          800: "#0e0c0a",
          900: "#070504",
        },
      },
      fontFamily: {
        cinzel: ["var(--font-cinzel)", "serif"],
        inter: ["var(--font-inter)", "sans-serif"],
      },
      backgroundImage: {
        "gold-gradient":
          "linear-gradient(135deg, #c9a84c 0%, #e8c96d 50%, #c9a84c 100%)",
        "dark-gradient":
          "linear-gradient(135deg, #0e0c0a 0%, #13110f 50%, #0e0c0a 100%)",
        "card-gradient":
          "linear-gradient(135deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.02) 100%)",
      },
      boxShadow: {
        gold: "0 0 30px rgba(201, 168, 76, 0.3)",
        "gold-lg": "0 0 60px rgba(201, 168, 76, 0.4)",
        card: "0 8px 32px rgba(0, 0, 0, 0.5)",
      },
      animation: {
        "pulse-gold": "pulseGold 2s ease-in-out infinite",
        float: "float 6s ease-in-out infinite",
        shimmer: "shimmer 2.5s linear infinite",
      },
      keyframes: {
        pulseGold: {
          "0%, 100%": { boxShadow: "0 0 20px rgba(201,168,76,0.3)" },
          "50%": { boxShadow: "0 0 40px rgba(201,168,76,0.7)" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-20px)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-1000px 0" },
          "100%": { backgroundPosition: "1000px 0" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
