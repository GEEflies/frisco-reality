'use client';

import { useEffect, useState } from 'react';

type MediaQueryListener = (matches: boolean) => void;

function subscribeToMediaQuery(
    mediaQueryList: MediaQueryList,
    listener: MediaQueryListener
): () => void {
    const handleChange = (event: MediaQueryListEvent) => listener(event.matches);

    if ('addEventListener' in mediaQueryList) {
        mediaQueryList.addEventListener('change', handleChange);
        return () => mediaQueryList.removeEventListener('change', handleChange);
    }

    const legacyMediaQueryList = mediaQueryList as MediaQueryList & {
        addListener: (listener: (event: MediaQueryListEvent) => void) => void;
        removeListener: (listener: (event: MediaQueryListEvent) => void) => void;
    };

    legacyMediaQueryList.addListener(handleChange);
    return () => legacyMediaQueryList.removeListener(handleChange);
}

export function useMediaQuery(query: string): boolean {
    const [matches, setMatches] = useState(false);

    useEffect(() => {
        if (typeof window === 'undefined') {
            return;
        }

        const mediaQueryList = window.matchMedia(query);
        setMatches(mediaQueryList.matches);

        return subscribeToMediaQuery(mediaQueryList, setMatches);
    }, [query]);

    return matches;
}