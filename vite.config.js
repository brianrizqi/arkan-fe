import { defineConfig } from 'vite';
import tailwindcss from '@tailwindcss/vite';
import { resolve } from 'path';

export default defineConfig({
    plugins: [
        tailwindcss(),
    ],
    build: {
        outDir: 'dist',
        rollupOptions: {
            input: {
                main: resolve(__dirname, 'index.html'),
                about: resolve(__dirname, 'about.html'),
                contact: resolve(__dirname, 'contact.html'),
                journal: resolve(__dirname, 'journal.html'),
                portfolio: resolve(__dirname, 'portfolio.html')
            }
        }
    },
    server: {
        port: 3000,
    }
});
