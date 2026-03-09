'use client';

import { useState } from 'react';
import Image from 'next/image';
import listingImageLoader from '@/lib/imageLoader';
import { isEnhancedImage } from '@/api/listingsService';
import { MapPin, Heart, LucideIcon } from 'lucide-react';
import confetti from 'canvas-confetti';
import { useLanguage } from '@/i18n/LanguageProvider';

interface ListingCardProps {
    title: string;
    price: string;
    location: string;
    description?: string;
    // Flexible features array to handle different property types (e.g. rooms vs beds/baths)
    features: Array<{
        icon: LucideIcon;
        label: string | number;
    }>;
    image?: string;
    status: string;
    statusColor?: string;
    onClick?: () => void;
}

export const ListingCard = ({
    title,
    price,
    location,
    description,
    features,
    image,
    status,
    statusColor = "bg-navy",
    onClick
}: ListingCardProps) => {
    const { language } = useLanguage();
    const detailLabel = language === 'sk' ? 'Zobraziť detail' : language === 'en' ? 'View detail' : 'Details ansehen';
    const [isLiked, setIsLiked] = useState(false);

    const handleLike = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.stopPropagation();
        e.preventDefault();

        const newState = !isLiked;
        setIsLiked(newState);

        if (newState) {
            const rect = e.currentTarget.getBoundingClientRect();
            const x = (rect.left + rect.width / 2) / window.innerWidth;
            const y = (rect.top + rect.height / 2) / window.innerHeight;

            confetti({
                particleCount: 25,
                spread: 40,
                origin: { x, y },
                colors: ['#F472B6', '#EC4899', '#DB2777'],
                ticks: 120,
                gravity: 0.8,
                scalar: 0.7,
                startVelocity: 15,
                disableForReducedMotion: true
            });
        }
    };

    return (
        <div
            onClick={onClick}
            className="bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-500 group border border-black/5 flex flex-col h-full cursor-pointer relative"
        >
            {/* Image Container */}
            <div className="relative h-[250px] overflow-hidden">
                {/* Status Badge */}
                <span className={`absolute top-4 left-4 ${statusColor} text-white px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider shadow-sm z-20`}>
                    {status}
                </span>

                {/* Heart Icon */}
                <button
                    onClick={handleLike}
                    className={`absolute top-4 right-4 bg-white/90 hover:bg-white p-2.5 rounded-full shadow-sm z-20 transition-all duration-300 active:scale-90 ${isLiked ? 'text-pink-500' : 'text-black'}`}
                >
                    <Heart
                        className={`w-5 h-5 transition-all duration-300 ${isLiked ? 'fill-pink-500 scale-110' : 'scale-100'}`}
                    />
                </button>

                {/* Hover Overlay with Text */}
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10 flex items-center justify-center">
                    <span className="text-white font-medium text-lg tracking-wide transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                        {detailLabel}
                    </span>
                </div>

                {image ? (
                    <>
                        <Image
                            loader={listingImageLoader}
                            src={image}
                            alt={title}
                            fill
                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                            quality={75}
                            className="object-cover will-change-transform transition-transform duration-[900ms] ease-[cubic-bezier(0.25,0.46,0.45,0.94)] group-hover:scale-105"
                        />
                        {/* FRISCO watermark — only on AI-enhanced images (originals have it baked in) */}
                        {isEnhancedImage(image) && (
                            <img
                                src="/frisco-logo-hq.png"
                                alt=""
                                className="absolute bottom-2 right-2 w-[14%] min-w-[36px] max-w-[64px] opacity-[0.45] pointer-events-none drop-shadow-md z-10 select-none"
                                draggable={false}
                            />
                        )}
                    </>
                ) : (
                    <div className="w-full h-full bg-cream-dark flex items-center justify-center">
                        <span className="text-black/5 font-serif text-5xl italic tracking-tighter">FRISCO</span>
                    </div>
                )}
            </div>

            {/* Content */}
            <div className="p-6 flex flex-col flex-grow text-left">
                {/* Title First & Bigger */}
                <h3 className="text-2xl font-poppins font-bold text-black mb-1 line-clamp-2 leading-tight">
                    {title}
                </h3>

                {/* Price Smaller & Red */}
                <div className="text-lg font-bold text-accent-red mb-4">
                    {price}
                </div>

                {/* Location */}
                <div className="flex items-center gap-2 text-charcoal/60 text-sm mb-4">
                    <MapPin className="w-4 h-4 text-accent-red" />
                    {location}
                </div>

                {/* Description */}
                {description && (
                    <p className="text-charcoal/70 text-sm leading-relaxed line-clamp-2 mb-6 font-light">
                        {description}
                    </p>
                )}

                {/* Features / Specs */}
                <div className="mt-auto pt-6 border-t border-black/5 flex items-center justify-between text-black/70 text-sm">
                    {features.map((feature, index) => (
                        <div key={index} className="flex items-center gap-2">
                            <feature.icon className="w-4 h-4 text-black/40" />
                            {feature.label}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};
