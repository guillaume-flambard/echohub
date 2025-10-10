import '../css/app.css';
import './bootstrap';

import { createInertiaApp } from '@inertiajs/react';
import { resolvePageComponent } from 'laravel-vite-plugin/inertia-helpers';
import { createRoot } from 'react-dom/client';
import axios from './bootstrap';
import { initializeTheme } from './hooks/use-appearance';
import { useMatrixStore } from './stores/matrix';

const appName = import.meta.env.VITE_APP_NAME || 'Laravel';

function startApp() {
    createInertiaApp({
        title: (title) => (title ? `${title} - ${appName}` : appName),
        resolve: (name) =>
            resolvePageComponent(
                `./pages/${name}.tsx`,
                import.meta.glob('./pages/**/*.tsx'),
            ),
        setup({ el, App, props }) {
            const root = createRoot(el);

            root.render(<App {...props} />);
        },
        progress: {
            color: '#4B5563',
        },
    });

    // This will set light / dark mode on load...
    initializeTheme();

    // Initialize Matrix client from storage if available
    useMatrixStore.getState().initializeFromStorage();
}

// Initialize CSRF cookie before starting the app
axios.get('/sanctum/csrf-cookie').then(startApp).catch(startApp); // Start app even if CSRF endpoint fails
