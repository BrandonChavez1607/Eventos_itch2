# Eventos ITCH II (Vite + React + Tailwind)

    npm install
    npm run dev      # desarrollo en http://localhost:5173
    npm run build    # producción en /dist

Estructura: `src/context/AuthContext.jsx` (sesión y registros), `src/components/*` (UI), `src/data.js` (eventos), `src/lib/storage.js`.

**Aviso:** el login es de demostración (localStorage + hash SHA-256 en el navegador). Para producción, reemplaza las funciones `submit`, `logout` y `toggleReg` de `AuthContext.jsx` por llamadas a un backend (Supabase, Firebase Auth, API propia).
