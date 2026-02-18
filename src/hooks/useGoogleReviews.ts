'use client';

import { useEffect, useState } from 'react';

interface GoogleReviews {
  rating: number;
  totalReviews: number;
  lastUpdated: string;
  source?: string;
}

const SUPABASE_FUNCTION_URL = process.env.NEXT_PUBLIC_SUPABASE_URL
  ? `${process.env.NEXT_PUBLIC_SUPABASE_URL}/functions/v1/fetch-google-reviews`
  : null;

// Fallback data
const DEFAULT_REVIEWS: GoogleReviews = {
  rating: 4.2,
  totalReviews: 22,
  lastUpdated: new Date().toISOString(),
  source: 'default'
};

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
          // If cache is less than 24 hours old, use it and don't fetch
          if (Date.now() - timestamp < 24 * 60 * 60 * 1000) {
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