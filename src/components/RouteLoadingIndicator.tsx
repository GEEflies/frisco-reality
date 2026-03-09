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
            {isLoading && (
                <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-white/80 backdrop-blur-sm">
                    <div className="flex flex-col items-center gap-4">
                        <div className="relative w-12 h-12">
                            <div className="absolute inset-0 rounded-full border-[3px] border-navy/10" />
                            <div className="absolute inset-0 rounded-full border-[3px] border-transparent border-t-accent-red animate-spin" />
                        </div>
                        <img
                            src="/frisco-logo-hq.png"
                            alt="FRISCO"
                            className="h-5 opacity-60"
                            draggable={false}
                        />
                    </div>
                </div>
            )}
        </NavLoadingContext.Provider>
    );
}
