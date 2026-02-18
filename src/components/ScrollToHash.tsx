'use client';

import { useEffect } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';

export const ScrollToHash = () => {
    const pathname = usePathname();
    const searchParams = useSearchParams();

    useEffect(() => {
        const hash = window.location.hash;
        if (hash) {
            const id = hash.replace('#', '');

            // Function to attempt scrolling
            const attemptScroll = (attempts = 0) => {
                const element = document.getElementById(id);
                if (element) {
                    // Found it! Scroll.
                    setTimeout(() => {
                        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
                    }, 100);
                } else if (attempts < 10) {
                    // Not found yet (maybe loading/hydrating), retry in 100ms
                    setTimeout(() => attemptScroll(attempts + 1), 100);
                }
            };

            attemptScroll();
        }
    }, [pathname, searchParams]);

    return null;
};
