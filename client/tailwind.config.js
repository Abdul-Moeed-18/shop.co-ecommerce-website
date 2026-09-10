/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    container: {
      center: true,
      padding: "1rem",
      screens: { xl: "1240px" },
    },
    extend: {
      fontFamily: {
        display: ["'Poppins'", "sans-serif"],
        body: ["'Inter'", "sans-serif"],
      },
      colors: {
        ink: "#000000",
        cream: "#F2F0F1",
        graytext: "#6C7275",
        line: "#E8E8E8",
        sale: "#FF3333",
        star: "#FFC633",
      },
    },
  },
  plugins: [],
};
