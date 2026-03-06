'use client';

import { useEffect, useState } from 'react';

interface GoogleReviews {
  rating: number;
  totalReviews: number;
  lastUpdated: string;
  source?: string;
}

// Fallback data — keep in sync with real ratings when they change significantly
const DEFAULT_REVIEWS: GoogleReviews = {
  rating: 4.4,
  totalReviews: 30,
  lastUpdated: new Date().toISOString(),
  source: 'default'
};

// Cache TTL: 6 hours (was 24h — shorter so rating updates propagate faster)
const CACHE_TTL_MS = 6 * 60 * 60 * 1000;

export const useGoogleReviews = () => {
  const [reviews, setReviews] = useState<GoogleReviews>(DEFAULT_REVIEWS);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchReviews = async () => {
      // Check cache first
      const cached = localStorage.getItem('google-reviews');
      if (cached) {
        try {
          const { data, timestamp } = JSON.parse(cached);
          if (Date.now() - timestamp < CACHE_TTL_MS) {
            setReviews(data);
            setIsLoading(false);
            return;
          }
        } catch (e) {
          console.error('Failed to parse cached reviews:', e);
        }
      }

      try {
        const response = await fetch('/api/google-reviews', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();

        // Cache the data in localStorage
        localStorage.setItem('google-reviews', JSON.stringify({
          data,
          timestamp: Date.now()
        }));

        setReviews(data);
      } catch (error) {
        console.error('Failed to fetch reviews:', error);

        // Try to use old cached data if it exists (even if older than 24h)
        if (cached) {
          try {
            const { data } = JSON.parse(cached);
            setReviews(data);
            return;
          } catch (e) { }
        }

        // Fall back to default values
        setReviews(DEFAULT_REVIEWS);
      } finally {
        setIsLoading(false);
      }
    };

    fetchReviews();
  }, []);

  return { reviews, isLoading };
};