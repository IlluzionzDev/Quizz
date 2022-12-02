import '@styles/globals.scss';
import '@styles/design-system.scss';
import type { AppProps } from 'next/app';
import store from '../store/store';
import { Provider } from 'react-redux';
import '@fontsource/inter';
import '@fontsource/lexend-deca'
import '@fontsource/mulish'
import '@fontsource/source-sans-pro'

// Normal & Bold
import '@fontsource/poppins/700.css'
import '@fontsource/poppins/400.css'

export default function App({ Component, pageProps }: AppProps) {
    return (
        <Provider store={store}>
            <Component {...pageProps} />
        </Provider>
    );
}
