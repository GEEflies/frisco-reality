import Link from "next/link";
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Stránka nenájdená (404)',
  description: 'Požadovaná stránka nebola nájdená. Vráťte sa na úvodnú stránku Frisco Reality.',
  robots: {
    index: false,
    follow: true,
  },
};

export default function NotFound() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-muted">
      <div className="text-center">
        <h1 className="mb-4 text-4xl font-bold">404</h1>
        <p className="mb-4 text-xl text-muted-foreground">
          Ups! Stránka nebola nájdená
        </p>
        <Link
          href="/"
          className="text-primary underline hover:text-primary/90"
        >
          Späť na úvodnú stránku
        </Link>
      </div>
    </div>
  );
}
