/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}", "./public/index.html"],
  theme: {
    colors: {
      success: "#5ea500",
      error: "#9f0712",
    },
    extend: {
      colors: {
        primary: {
          light: "#F8F9FC", // 最浅色
          DEFAULT: "#BFC8EA", // 中间色
          dark: "#7B86AA", // 深色
        },
        secondary: {
          light: "#5B67A2", // 次要浅色
          DEFAULT: "#545051", // 次要深色
        },
      },
      animation: {
        "fade-in": "fadeIn 0.3s ease-in-out",
        "slide-up": "slideUp 0.3s ease-out",
        "slide-down": "slide-down 0.3s ease-out",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        slideUp: {
          "0%": { transform: "translateY(10px)", opacity: "0" },
          "100%": { transform: "translateY(0)", opacity: "1" },
        },
        "slide-down": {
          "0%": { transform: "translate(-50%, -100%)" },
          "100%": { transform: "translate(-50%, 0)" },
        },
        "slide-up": {
          "0%": { transform: "translate(-50%, 0)" },
          "100%": { transform: "translate(-50%, -100%)" },
        },
      },
    },
  },
  plugins: [],
};
