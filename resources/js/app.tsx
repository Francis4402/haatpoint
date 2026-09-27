import '../css/app.css';
import './bootstrap';
import 'react-lazy-load-image-component/src/effects/blur.css';
import { createInertiaApp, router } from '@inertiajs/react';
import { resolvePageComponent } from 'laravel-vite-plugin/inertia-helpers';
import { Suspense } from 'react';
import { createRoot } from 'react-dom/client';
import { Toaster } from 'sonner';

const appName = import.meta.env.VITE_APP_NAME || 'Laravel';

declare global {
    interface Window {
        dataLayer: unknown[];
        gtag: (...args: unknown[]) => void;
    }
}

if (typeof window !== 'undefined') {
    const GA_ID = 'G-X8W80PQ84Y';

    const gtagScript = document.createElement('script');
    gtagScript.async = true;
    gtagScript.src = `https://www.googletagmanager.com/gtag/js?id=${GA_ID}`;
    document.head.appendChild(gtagScript);

    const inlineScript = document.createElement('script');
    inlineScript.textContent = `
        window.dataLayer = window.dataLayer || [];
        function gtag(){dataLayer.push(arguments);}
        gtag('js', new Date());
        gtag('config', '${GA_ID}', { anonymize_ip: true });
    `;
    document.head.appendChild(inlineScript);
}

createInertiaApp({
    title: (title) => `${title} - ${appName}`,
    resolve: (name) =>
        resolvePageComponent(
            `./Pages/${name}.tsx`,
            import.meta.glob('./Pages/**/*.tsx'),
        ),
    setup({ el, App, props }) {
        const root = createRoot(el);

        root.render(<Suspense fallback={<div>Loading...</div>}>
            <App {...props} />
            <Toaster position="top-right" />
        </Suspense>);
    },
    progress: {
        color: '#6E7F5C',
    },
});

router.on('success', () => {
    if (typeof window.gtag !== 'function') return;
    window.gtag('event', 'page_view', {
        page_title: document.title,
        page_location: window.location.href,
        page_path: window.location.pathname + window.location.search,
    });
});
