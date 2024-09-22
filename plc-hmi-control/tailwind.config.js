module.exports = {
  content: [
    './src/app/**/*.{js,ts,jsx,tsx}', // Esto busca todos los archivos JS/TS/JSX/TSX dentro de `src/app`
    './src/components/**/*.{js,ts,jsx,tsx}', // Si tienes más componentes fuera de app, también inclúyelos
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
