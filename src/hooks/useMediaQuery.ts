'use client';

import { useState, useEffect } from "react";

export function useMediaQuery(query: string): boolean {
    // Always start with false to ensure server/client consistency
    const [matches, setMatches] = useState<boolean>(false);

    useEffect(() => {
        const media = window.matchMedia(query);
        
        // Set the actual value after mount
        setMatches(media.matches);

        // Use the modern 'change' event instead of deprecated addListener
        const handleChange = (event: MediaQueryListEvent) => {
            setMatches(event.matches);
        };

        media.addEventListener("change", handleChange);

        return () => {
            media.removeEventListener("change", handleChange);
        };
    }, [query]);

    return matches;
}