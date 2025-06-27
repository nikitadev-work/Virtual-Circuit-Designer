import '../src/styles/global.css';
import '../src/styles/style.css';

import * as React from 'react';
import { useEffect, useState } from 'react';
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

    return (
        <div className="fade-container" key={router.pathname}>
            <Component {...pageProps} />
        </div>
    );
}
