// Import SCSS utils
import '@illuzionz-studios/design-system/styles';
import '@styles/global.scss';
import type { AppProps } from 'next/app';
import store from 'store';
import { Provider } from 'react-redux';

// Font stlying
import '@fontsource/poppins/700.css';
import '@fontsource/poppins/600.css';
import '@fontsource/poppins/500.css';
import '@fontsource/poppins/400.css';
import '@fontsource/inter/700.css';
import '@fontsource/inter/400.css';
import { ThemeProvider } from '@illuzionz-studios/design-system';
import Head from 'next/head';
import { useEffect } from 'react';
import { ToastProvider } from '@components/toasts/toast-provider';

// Remove logging in prod env
if (process.env.NODE_ENV === 'production') {
    console.log = () => {};
    console.error = () => {};
    console.debug = () => {};
}

export default function App({ Component, pageProps, router }: AppProps) {
    useEffect(() => {
        // Set var(--vh) to actual view height of viewport
        const setHeight = () => {
            document.documentElement.style.setProperty('--vh', window.innerHeight + 'px');
        };

        // Update viewport on resize
        window.addEventListener('resize', setHeight);
        setHeight();
    }, []);

    return (
        <ThemeProvider>
            <ToastProvider>
                <Provider store={store}>
                    <Head>
                        <title>Quizz | Quiz your friends in real-time</title>
                        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, height=device-height" />
                    </Head>
                    <Component {...pageProps} key={router.asPath} />
                </Provider>
            </ToastProvider>
        </ThemeProvider>
    );
}
