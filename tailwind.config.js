/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}", // Asegúrate de que todas las rutas estén correctas
  ],
  theme: {
    extend: {},
  },
  plugins: [],
  important: true, // Esto fuerza a que los estilos de Tailwind tengan mayor especificidad
};