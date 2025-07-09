'use client';

import { useRouter } from 'next/navigation';
import Image from 'next/image';

export function BackToDashboardButton() {
    const router = useRouter();

    return (
        <button
            className="settings-btn"
            onClick={() => router.push('/dashboard')}
        >
            <Image
                src="/Icons/Logos/home.svg"
                width={40}
                height={40}
                className="home-vec"
                alt="home"
            />
        </button>
    );
}
