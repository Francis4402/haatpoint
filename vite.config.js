import { defineConfig } from 'vite';
import laravel from 'laravel-vite-plugin';
import react from '@vitejs/plugin-react';
import { fileURLToPath } from 'node:url';

export default defineConfig({
    plugins: [
        laravel({
            input: 'resources/js/app.tsx',
            ssr: 'resources/js/ssr.tsx',
            refresh: true,
        }),
        react(),
    ],
    resolve: {
        alias: {
            'ziggy-js': fileURLToPath(new URL('./vendor/tightenco/ziggy', import.meta.url)),
        },
    },
    ssr: {
        // Bundle dependencies into the SSR output. Several of them (e.g.
        // react-lazy-load-image-component) are CommonJS, and Node's ESM loader
        // cannot resolve their named exports when they are left external.
        noExternal: true,
    },
});
