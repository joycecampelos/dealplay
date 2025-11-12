/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}", // analisa todos os componentes React
  ],
  theme: {
    extend: {
      colors: {
        primary: "#2b6cb0", // azul principal (navbar, botões, links)
        secondary: "#ffd700", // dourado (hover, destaque)
        background: "#f8fafc", // fundo leve
        text: "#1e293b", // texto padrão (cinza-escuro)
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "Avenir", "Helvetica", "Arial", "sans-serif"],
      },
      boxShadow: {
        card: "0 2px 8px rgba(0, 0, 0, 0.15)", // sombra personalizada para cards
      },
    },
  },
  plugins: [],
};
