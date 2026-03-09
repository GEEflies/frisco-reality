'use client';

import { useEffect, useState, useTransition } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';

/**
 * Full-screen branded loading overlay shown during Next.js route transitions.
 *
 * Displays after a short delay (300ms) to avoid flashing on fast navigations.
 * Uses FRISCO brand colours: navy background with accent-red spinner ring.
 */
export function RouteLoadingIndicator() {
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const [isNavigating, setIsNavigating] = useState(false);
    const [showOverlay, setShowOverlay] = useState(false);

    // Detect route changes: when pathname or searchParams change, navigation is done
    useEffect(() => {
        setIsNavigating(false);
        setShowOverlay(false);
    }, [pathname, searchParams]);

    // Listen for click on internal links / programmatic navigation
    useEffect(() => {
        let delayTimer: ReturnType<typeof setTimeout>;

        const handleClick = (e: MouseEvent) => {
            const anchor = (e.target as HTMLElement).closest('a');
            // Only internal same-origin links
            if (anchor && anchor.href && anchor.origin === window.location.origin) {
                const targetUrl = anchor.href;
                // Skip hash-only links, same page
                if (targetUrl === window.location.href) return;
                if (anchor.target === '_blank') return;

                setIsNavigating(true);
                // Only show the overlay after 300ms to avoid flash on fast navigations
                delayTimer = setTimeout(() => setShowOverlay(true), 300);
            }
        };

        // Also intercept router.push via history pushState
        const originalPushState = history.pushState.bind(history);
        history.pushState = function (...args) {
            setIsNavigating(true);
            delayTimer = setTimeout(() => setShowOverlay(true), 300);
            return originalPushState(...args);
        };

        document.addEventListener('click', handleClick, true);

        return () => {
            document.removeEventListener('click', handleClick, true);
            history.pushState = originalPushState;
            clearTimeout(delayTimer);
        };
    }, []);

    // Clear delay timer when navigation finishes
    useEffect(() => {
        if (!isNavigating) {
            setShowOverlay(false);
        }
    }, [isNavigating]);

    if (!showOverlay) return null;

    return (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-white/80 backdrop-blur-sm transition-opacity duration-200">
            <div className="flex flex-col items-center gap-4">
                {/* Spinning ring in brand colours */}
                <div className="relative w-12 h-12">
                    <div className="absolute inset-0 rounded-full border-[3px] border-navy/10" />
                    <div className="absolute inset-0 rounded-full border-[3px] border-transparent border-t-accent-red animate-spin" />
                </div>
                {/* FRISCO logo */}
                <img
                    src="/frisco-logo-hq.png"
                    alt="FRISCO"
                    className="h-5 opacity-60"
                    draggable={false}
                />
            </div>
        </div>
    );
}
