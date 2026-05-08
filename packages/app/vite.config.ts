import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';

export default defineConfig({
    plugins: [react()],
    build: {
        outDir: resolve(__dirname, '../../dist/app'),
        emptyOutDir: true,
    },
    server: {
        port: process.env.APP_PORT ? parseInt(process.env.APP_PORT) : 3001,
    },
});
