import { wayfinder } from '@laravel/vite-plugin-wayfinder';
import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import laravel from 'laravel-vite-plugin';
import { defineConfig } from 'vite';

export default defineConfig(({ isSsrBuild }) => ({
    plugins: [
        laravel({
            input: ['resources/css/app.css', 'resources/js/app.tsx'],
            ssr: 'resources/js/ssr.tsx',
            refresh: true,
        }),
        react(),
        tailwindcss(),
        // Skip Wayfinder in production builds - routes are pre-generated and committed
        ...(process.env.SKIP_WAYFINDER ? [] : [
            wayfinder({
                formVariants: true,
            }),
        ]),
    ],
    esbuild: {
        jsx: 'automatic',
    },
    build: {
        // Matrix SDK is large (~875 kB) due to encryption features - this is expected
        chunkSizeWarningLimit: 1000,
        rollupOptions: {
            output: {
                // Only apply manualChunks for client builds, not SSR
                ...(isSsrBuild ? {} : {
                    manualChunks: {
                        // React core
                        'react-vendor': ['react', 'react-dom'],

                        // Inertia
                        'inertia': ['@inertiajs/react'],

                        // Charts library
                        'recharts': ['recharts'],

                        // Matrix SDK (large due to crypto features)
                        'matrix-sdk': ['matrix-js-sdk'],

                        // UI components
                        'radix-ui': [
                            '@radix-ui/react-avatar',
                            '@radix-ui/react-checkbox',
                            '@radix-ui/react-collapsible',
                            '@radix-ui/react-dialog',
                            '@radix-ui/react-dropdown-menu',
                            '@radix-ui/react-label',
                            '@radix-ui/react-navigation-menu',
                            '@radix-ui/react-select',
                            '@radix-ui/react-separator',
                            '@radix-ui/react-slot',
                            '@radix-ui/react-toggle',
                            '@radix-ui/react-toggle-group',
                            '@radix-ui/react-tooltip',
                        ],

                        // Icons
                        'lucide': ['lucide-react'],

                        // State management
                        'zustand': ['zustand'],
                    },
                }),
            },
        },
    },
}));
