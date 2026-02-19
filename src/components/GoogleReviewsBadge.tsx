'use client';

import { Star } from 'lucide-react';
import { useGoogleReviews } from '@/hooks/useGoogleReviews';
import { useLanguage } from '@/i18n/LanguageProvider';

export const GoogleReviewsBadge = () => {
    const { language } = useLanguage();
    const { reviews, isLoading } = useGoogleReviews();
    const copy = {
        sk: {
            basedOn: 'Na základe',
            reviews: 'recenzií',
        },
        en: {
            basedOn: 'Based on',
            reviews: 'reviews',
        },
        de: {
            basedOn: 'Basierend auf',
            reviews: 'Bewertungen',
        },
    }[language];

    // Calculate full stars and partial star percentage
    const fullStars = Math.floor(reviews.rating);
    const partialStarPercentage = ((reviews.rating % 1) * 100).toFixed(0);

    return (
        <div
            className="inline-flex flex-col items-start gap-1"
        >
            {/* Header: Google Logo + Rating */}
            <div className="flex items-center gap-2 mb-1">
                <img
                    src="/google-logo.svg"
                    alt="Google"
                    className="w-5 h-5 bg-white rounded-full"
                />
                <span className="text-navy font-bold text-base bg-gradient-to-r from-navy to-navy/80 bg-clip-text">
                    Google
                </span>
            </div>

            {/* Stars Row */}
            <div className="flex items-center gap-3">
                <div className="flex gap-0.5">
                    {/* Full stars */}
                    {[...Array(fullStars)].map((_, i) => (
                        <Star
                            key={`full-${i}`}
                            size={18}
                            fill="#FBBC05"
                            className="text-[#FBBC05]"
                        />
                    ))}

                    {/* Partial star if needed */}
                    {fullStars < 5 && (
                        <div className="relative">
                            <Star
                                size={18}
                                fill="#e5e7eb"
                                className="text-gray-200"
                            />
                            <div
                                className="absolute top-0 left-0 overflow-hidden"
                                style={{ width: `${partialStarPercentage}%` }}
                            >
                                <Star
                                    size={18}
                                    fill="#FBBC05"
                                    className="text-[#FBBC05]"
                                />
                            </div>
                        </div>
                    )}

                    {/* Empty stars */}
                    {[...Array(Math.max(0, 4 - fullStars))].map((_, i) => (
                        <Star
                            key={`empty-${i}`}
                            size={18}
                            fill="#e5e7eb"
                            className="text-gray-200"
                        />
                    ))}
                </div>

                <span className="text-2xl font-sans font-bold text-navy leading-none pt-0.5">
                    {isLoading ? '...' : reviews.rating.toFixed(1)}
                </span>
            </div>

            {/* Review Count Info */}
            <span className="text-sm text-charcoal/60 mt-1 transition-colors border-b border-transparent">
                {copy.basedOn} <strong>{isLoading ? '...' : reviews.totalReviews} {copy.reviews}</strong>
            </span>
        </div>
    );
};