import { createInertiaApp } from '@inertiajs/react'
import createServer from '@inertiajs/react/server'
import { resolvePageComponent } from 'laravel-vite-plugin/inertia-helpers'
import { route } from 'ziggy-js'
import ReactDOMServer from 'react-dom/server'
import { Suspense } from 'react'
import { Toaster } from 'sonner'

const appName = import.meta.env.VITE_APP_NAME || 'HaatPoint'

createServer((page: any) =>
    createInertiaApp({
        page,
        render: ReactDOMServer.renderToString,
        title: (title) => `${title} - ${appName}`,
        resolve: (name) =>
            resolvePageComponent(
                `./Pages/${name}.tsx`,
                import.meta.glob('./Pages/**/*.tsx'),
            ),
        setup: ({ App, props }: any) => {
            // The @routes Blade directive makes route() global in the browser,
            // but there is no window/Blade on the Node SSR server, so it has to
            // be wired up from the Ziggy config shared via Inertia props.
            const ziggy = props.initialPage?.props?.ziggy
            ;(globalThis as any).route = (name: string, params?: any, absolute?: boolean) =>
                route(name, params, absolute, ziggy)

            return (
                <Suspense fallback={null}>
                    <App {...props} />
                    <Toaster position="top-right" />
                </Suspense>
            )
        },
    }),
)
