'use client';

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { LanguageProvider } from "@/i18n/LanguageProvider";
import type { LanguageCode } from "@/i18n/types";
import { useState } from "react";
import { useScrollReveal } from "@/hooks/useScrollReveal";

export function Providers({ children, initialLanguage }: { children: React.ReactNode; initialLanguage: LanguageCode }) {
  const [queryClient] = useState(() => new QueryClient());
  useScrollReveal();

  return (
    <QueryClientProvider client={queryClient}>
      <LanguageProvider initialLanguage={initialLanguage}>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          {children}
        </TooltipProvider>
      </LanguageProvider>
    </QueryClientProvider>
  );
}
