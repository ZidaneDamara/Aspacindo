import { defineConfig } from 'vite';
import laravel from 'laravel-vite-plugin';
import react from '@vitejs/plugin-react';

export default defineConfig({
    plugins: [
        laravel({
            input: 'resources/js/app.jsx',
            refresh: true,
        }),
        react(),
    ],
    build: {
        cssCodeSplit: true,
        chunkSizeWarningLimit: 600,
        rollupOptions: {
            output: {
                manualChunks(id) {
                    if (id.includes('node_modules/react') || id.includes('node_modules/react-dom') || id.includes('node_modules/scheduler')) {
                        return 'react-vendor';
                    }
                    if (id.includes('node_modules/@inertiajs')) {
                        return 'inertia-vendor';
                    }
                    if (id.includes('node_modules/@tiptap') || id.includes('node_modules/prosemirror')) {
                        return 'tiptap-vendor';
                    }
                    if (id.includes('node_modules/swiper')) {
                        return 'swiper-vendor';
                    }
                    if (id.includes('node_modules/axios')) {
                        return 'axios-vendor';
                    }
                },
            },
        },
    },
});
