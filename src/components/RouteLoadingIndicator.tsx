'use client';

import { createContext, useContext, useCallback, useEffect, useRef, useState } from 'react';
import { usePathname } from 'next/navigation';

/**
 * Lightweight navigation-loading context.
 *
 * Listing click handlers call `startNavLoading()` before router.push().
 * The pathname change (once the new page renders) automatically clears it.
 * A 5-second safety timeout prevents an infinite spinner if something goes wrong.
 */

interface NavLoadingCtx {
    isLoading: boolean;
    startNavLoading: () => void;
}

const NavLoadingContext = createContext<NavLoadingCtx>({
    isLoading: false,
    startNavLoading: () => {},
});

export const useNavLoading = () => useContext(NavLoadingContext);

/* ── keyframe styles injected once via <style> ── */
const LOADING_STYLES = `
@keyframes frisco-fade-in {
  from { opacity: 0; }
  to   { opacity: 1; }
}
@keyframes frisco-logo-enter {
  0%   { opacity: 0; transform: scale(0.85) translateY(6px); filter: blur(4px); }
  100% { opacity: 1; transform: scale(1) translateY(0); filter: blur(0); }
}
@keyframes frisco-ring-spin {
  from { transform: rotate(0deg); }
  to   { transform: rotate(360deg); }
}
@keyframes frisco-ring-dash {
  0%   { stroke-dashoffset: 157; }
  50%  { stroke-dashoffset: 40; }
  100% { stroke-dashoffset: 157; }
}
@keyframes frisco-shimmer {
  0%   { opacity: 0.35; }
  50%  { opacity: 0.7; }
  100% { opacity: 0.35; }
}
@keyframes frisco-dots {
  0%, 20% { opacity: 0; }
  40%     { opacity: 1; }
  100%    { opacity: 1; }
}
`;

function LoadingOverlay() {
    const [visible, setVisible] = useState(false);

    /* Small delay so ultra-fast navigations never flash the loader */
    useEffect(() => {
        const id = setTimeout(() => setVisible(true), 80);
        return () => clearTimeout(id);
    }, []);

    if (!visible) return null;

    return (
        <>
            <style>{LOADING_STYLES}</style>
            <div
                className="fixed inset-0 z-[9999] flex items-center justify-center"
                style={{
                    background: 'linear-gradient(180deg, rgba(255,255,255,0.92) 0%, rgba(248,247,245,0.96) 100%)',
                    backdropFilter: 'blur(12px)',
                    WebkitBackdropFilter: 'blur(12px)',
                    animation: 'frisco-fade-in 0.25s ease-out both',
                }}
            >
                <div
                    className="flex flex-col items-center"
                    style={{ animation: 'frisco-logo-enter 0.5s cubic-bezier(0.22,1,0.36,1) 0.05s both' }}
                >
                    {/* Animated ring */}
                    <div className="relative w-[72px] h-[72px] mb-5">
                        {/* Faint static ring background */}
                        <svg
                            className="absolute inset-0 w-full h-full"
                            viewBox="0 0 72 72"
                            fill="none"
                        >
                            <circle
                                cx="36" cy="36" r="32"
                                stroke="hsl(0 0% 10% / 0.06)"
                                strokeWidth="2.5"
                            />
                        </svg>

                        {/* Spinning gradient arc */}
                        <svg
                            className="absolute inset-0 w-full h-full"
                            viewBox="0 0 72 72"
                            fill="none"
                            style={{ animation: 'frisco-ring-spin 1.1s linear infinite' }}
                        >
                            <defs>
                                <linearGradient id="frisco-arc-grad" x1="0" y1="0" x2="1" y2="1">
                                    <stop offset="0%" stopColor="hsl(0 72% 51%)" stopOpacity="1" />
                                    <stop offset="100%" stopColor="hsl(0 72% 51%)" stopOpacity="0.1" />
                                </linearGradient>
                            </defs>
                            <circle
                                cx="36" cy="36" r="32"
                                stroke="url(#frisco-arc-grad)"
                                strokeWidth="2.5"
                                strokeLinecap="round"
                                strokeDasharray="157"
                                style={{ animation: 'frisco-ring-dash 1.6s ease-in-out infinite' }}
                            />
                        </svg>

                        {/* Centre dot pulse */}
                        <div
                            className="absolute rounded-full bg-accent-red"
                            style={{
                                width: 6, height: 6,
                                top: '50%', left: '50%',
                                transform: 'translate(-50%, -50%)',
                                animation: 'frisco-shimmer 1.6s ease-in-out infinite',
                            }}
                        />
                    </div>

                    {/* Logo */}
                    <img
                        src="/frisco-logo-hq.png"
                        alt="FRISCO"
                        draggable={false}
                        className="h-6 select-none"
                        style={{
                            opacity: 0,
                            animation: 'frisco-logo-enter 0.6s cubic-bezier(0.22,1,0.36,1) 0.2s forwards',
                        }}
                    />

                    {/* Subtle loading dots */}
                    <div className="flex items-center gap-[5px] mt-4 h-2">
                        {[0, 1, 2].map(i => (
                            <span
                                key={i}
                                className="block w-[5px] h-[5px] rounded-full bg-charcoal/30"
                                style={{
                                    animation: `frisco-shimmer 1.2s ease-in-out ${i * 0.2}s infinite`,
                                }}
                            />
                        ))}
                    </div>
                </div>
            </div>
        </>
    );
}

export function NavLoadingProvider({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const [isLoading, setIsLoading] = useState(false);
    const safetyTimer = useRef<ReturnType<typeof setTimeout>>(undefined);

    const startNavLoading = useCallback(() => {
        setIsLoading(true);
        // Safety: never spin longer than 5 seconds
        clearTimeout(safetyTimer.current);
        safetyTimer.current = setTimeout(() => setIsLoading(false), 5000);
    }, []);

    // Pathname changed → new page rendered → stop loading
    useEffect(() => {
        setIsLoading(false);
        clearTimeout(safetyTimer.current);
    }, [pathname]);

    return (
        <NavLoadingContext.Provider value={{ isLoading, startNavLoading }}>
            {children}
            {isLoading && <LoadingOverlay />}
        </NavLoadingContext.Provider>
    );
}
