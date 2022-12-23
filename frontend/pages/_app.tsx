// Import SCSS utils
import '@design-system/design-system.scss';
import type { AppProps } from 'next/app';
import store from '../store/store';
import { Provider } from 'react-redux';

// Font stlying
import '@fontsource/poppins/700.css';
import '@fontsource/poppins/600.css';
import '@fontsource/poppins/500.css';
import '@fontsource/poppins/400.css';
import '@fontsource/inter/700.css';
import '@fontsource/inter/400.css';
import { ThemeProvider } from '@design-system/theme';

export default function App({ Component, pageProps }: AppProps) {
    return (
        <ThemeProvider>
            <Provider store={store}>
                <Component {...pageProps} />
            </Provider>
        </ThemeProvider>
    );
}
