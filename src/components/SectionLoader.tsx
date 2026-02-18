'use client';

import { Suspense, useRef, useState, useEffect, ComponentType, useCallback } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

interface SectionLoaderProps {
    component: React.LazyExoticComponent<ComponentType<any>>;
}

const MountedNotifier = ({ onMount }: { onMount: () => void }) => {
    useEffect(() => {
        onMount();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
    return null;
};

export const SectionLoader = ({ component: Component }: SectionLoaderProps) => {
    const [isVisible, setIsVisible] = useState(false);
    const ref = useRef<HTMLDivElement>(null);

    const refreshScroll = useCallback(() => {
        // Some sections use GSAP pinning; when a lazy section mounts it can change heights.
        // Without a refresh (and Lenis resize), the page can appear "stuck" until a resize occurs.
        try {
            (window as any).__lenis?.resize?.();
            gsap.registerPlugin(ScrollTrigger);
            ScrollTrigger.refresh();
        } catch {
            // no-op (GSAP not available / not initialized yet)
        }
    }, []);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsVisible(true);
                    observer.disconnect();
                }
            },
            { rootMargin: '200px' } // Start loading 200px before viewport
        );

        if (ref.current) {
            observer.observe(ref.current);
        }

        return () => observer.disconnect();
    }, []);

    useEffect(() => {
        if (!isVisible) return;
        // Refresh once immediately, and again after layout settles.
        requestAnimationFrame(refreshScroll);
        const t = window.setTimeout(refreshScroll, 250);
        return () => window.clearTimeout(t);
    }, [isVisible, refreshScroll]);

    return (
        <div ref={ref} className="min-h-[10vh]">
            {isVisible ? (
                <Suspense fallback={<div className="h-20" />}>
                    <MountedNotifier onMount={refreshScroll} />
                    <Component />
                </Suspense>
            ) : (
                <div className="h-20" /> // Placeholder
            )}
        </div>
    );
};

