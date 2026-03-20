/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      boxShadow: {
        ink: "10px 10px 0 rgba(0, 0, 0, 0.12)",
      },
      backgroundImage: {
        grid: "linear-gradient(rgba(255,255,255,.06) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.06) 1px, transparent 1px)",
      },
    },
  },
  plugins: [],
};
