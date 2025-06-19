import '../src/styles/style.css';
import '../src/styles/global.css';

import * as React from 'react';

import { useEffect } from 'react';
import { useRouter } from 'next/router';

export default function MyApp({ Component, pageProps }) {
    const router = useRouter();

    useEffect(() => {
        if (router.pathname === '/playground') {
            document.body.classList.add('playground');
        } else {
            document.body.classList.remove('playground');
        }
    }, [router.pathname]);

    return <Component {...pageProps} />;
}
