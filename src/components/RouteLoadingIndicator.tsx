'use client';

import { useEffect, useState, useTransition } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';

/**
 * Branded loading overlay shown when navigating to a listing detail page.
 *
 * Only triggers for /nehnutelnost/ URLs (slow due to data fetch).
 * Regular nav (ponuka, kontakt, etc.) loads instantly — no overlay needed.
 * Displays after a short delay (250ms) to avoid flash on cached pages.
 */

const SLOW_ROUTE_PATTERN = /\/nehnutelnost\//;

function isSlowRoute(url: string): boolean {
    try {
        const path = new URL(url, window.location.origin).pathname;
        return SLOW_ROUTE_PATTERN.test(path);
    } catch {
        return false;
    }
}

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
            if (anchor && anchor.href && anchor.origin === window.location.origin) {
                if (anchor.href === window.location.href) return;
                if (anchor.target === '_blank') return;
                if (!isSlowRoute(anchor.href)) return;

                setIsNavigating(true);
                delayTimer = setTimeout(() => setShowOverlay(true), 250);
            }
        };

        // Also intercept router.push via history pushState
        const originalPushState = history.pushState.bind(history);
        history.pushState = function (...args) {
            const url = typeof args[2] === 'string' ? args[2] : '';
            if (isSlowRoute(url)) {
                setIsNavigating(true);
                delayTimer = setTimeout(() => setShowOverlay(true), 250);
            }
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
