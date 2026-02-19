'use client';

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { MotionConfig } from "framer-motion";
import { useState, useEffect } from "react";

export function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(() => new QueryClient());

  // Default to "always" (reduced motion) to prevent SSR hydration flash.
  // On desktop, switch to "never" after hydration so scroll-triggered
  // animations work normally. Mobile stays "always" (no animations, no flash).
  const [reducedMotion, setReducedMotion] = useState<"always" | "never">("always");

  useEffect(() => {
    if (window.innerWidth >= 1024) {
      // Desktop: enable animations after first paint
      requestAnimationFrame(() => {
        setReducedMotion("never");
      });
    }
    // Mobile: keep "always" — user prefers no animations over flicker
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <MotionConfig reducedMotion={reducedMotion}>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          {children}
        </TooltipProvider>
      </MotionConfig>
    </QueryClientProvider>
  );
}
