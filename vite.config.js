//import the defineConfig function from vite
import { defineConfig } from 'vite';

//import react plugin for vite
import react from '@vitejs/plugin-react';

// tells vite to enable and use the react plugin when building the project
export default defineConfig({
  plugins: [react()],
});
