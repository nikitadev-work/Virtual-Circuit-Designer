import '../src/styles/global.css';
import '../src/styles/style.css';
import * as React from 'react';

import { useEffect} from 'react';

import { useRouter } from 'next/router';
import { Toaster, toast } from 'sonner';

export default function MyApp({ Component, pageProps }) {
    const router = useRouter();

    useEffect(() => {
        // Проброс toast в window, чтобы использовать в обычном JS
        if (typeof window !== "undefined") {
            window.toast = toast;
        }

        if (router.pathname === '/playground') {
            document.body.classList.add('playground');
        } else {
            document.body.classList.remove('playground');
        }
    }, [router.pathname]);

    return (
        <>
            <div className="fade-container" key={router.pathname}>
                <Component {...pageProps} />
            </div>
            <Toaster
                richColors
                position="top-center"
                style={{ top: '80px' }}
                duration={3000}/>
        </>
    );
}
