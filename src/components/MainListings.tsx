'use client';

import Image from 'next/image';
import { motion } from 'framer-motion';
import { ChevronRight, Maximize, Home, MapPin, Clock } from 'lucide-react';

// Mockup data that mimics real listings
const MOCK_LISTINGS = [
    {
        id: 1,
        badge: 'Na predaj',
        badgeColor: 'bg-navy',
        gradient: 'from-slate-200 via-slate-100 to-stone-100',
        accentColor: '#1a2e4a',
        title: 'Rodinný dom · Sereď',
        price: '––– €',
        location: 'Sereď, Galanta',
        area: '120 m²',
        rooms: '4 izby',
    },
    {
        id: 2,
        badge: 'Prenájom',
        badgeColor: 'bg-sky-500',
        gradient: 'from-stone-200 via-amber-50 to-stone-100',
        accentColor: '#0ea5e9',
        title: 'Byt · Centrum',
        price: '––– €/mes.',
        location: 'Sereď, Galanta',
        area: '65 m²',
        rooms: '2 izby',
    },
    {
        id: 3,
        badge: 'Novostavba',
        badgeColor: 'bg-emerald-500',
        gradient: 'from-emerald-50 via-stone-100 to-slate-100',
        accentColor: '#10b981',
        title: 'Novostavba · Exkluzívne',
        price: '––– €',
        location: 'Sereď, Galanta',
        area: '95 m²',
        rooms: '3 izby',
    },
];

const MockListingCard = ({ listing, index, priority = false }: { listing: typeof MOCK_LISTINGS[0]; index: number; priority?: boolean }) => (
    <motion.div
        key={listing.id}
        className="min-w-[calc(33.333%-1.33rem)] flex-shrink-0"
        initial={{ opacity: 0, scale: 0.95, y: 20 }} // Simplified initial state
        whileInView={{ opacity: 1, scale: 1, y: 0 }}
        viewport={{ once: true, margin: '-50px' }}
        transition={{
            duration: 0.5, // Faster duration
            delay: index * 0.1, // Tighter stagger
            ease: "easeOut", // Simpler ease
        }}
    >
        <div className="bg-white rounded-3xl overflow-hidden shadow-sm border border-black/5 flex flex-col h-full relative group">

            {/* Image placeholder */}
            <div className={`relative h-[250px] overflow-hidden bg-gray-100 flex items-center justify-center`}>
                <Image
                    src="/frisco-reality-sered.jpg"
                    alt={listing.title}
                    fill
                    sizes="(max-width: 1024px) 100vw, 33vw"
                    priority={priority}
                    className="object-cover opacity-90 group-hover:opacity-100 transition-opacity duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                {/* Badge */}
                <span className={`absolute top-4 left-4 ${listing.badgeColor} text-white px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider shadow-sm z-20`}>
                    {listing.badge}
                </span>

                {/* Overlay only - no text/icon */}
                <div className="absolute inset-0 bg-white/30 backdrop-blur-[1px] z-10" />
            </div>

            {/* Card content */}
            <div className="p-6 flex flex-col flex-grow text-left">
                {/* Title */}
                <h4 className="text-2xl font-poppins font-bold text-black mb-1 leading-tight">
                    {listing.title}
                </h4>

                {/* Price */}
                <h3 className="text-lg font-bold text-accent-red mb-4">
                    {listing.price}
                </h3>

                {/* Location */}
                <div className="flex items-center gap-2 text-charcoal/60 text-sm mb-4">
                    <MapPin className="w-4 h-4 text-accent-red" />
                    {listing.location}
                </div>

                {/* Features */}
                <div className="mt-auto pt-6 border-t border-black/5 flex items-center justify-between text-black/70 text-sm">
                    <div className="flex items-center gap-2">
                        <Maximize className="w-4 h-4 text-black/40" />
                        {listing.area}
                    </div>
                    <div className="flex items-center gap-2">
                        <Home className="w-4 h-4 text-black/40" />
                        {listing.rooms}
                    </div>
                </div>
            </div>
        </div>
    </motion.div>
);

const MockListingCardMobile = ({ listing, index, priority = false }: { listing: typeof MOCK_LISTINGS[0]; index: number; priority?: boolean }) => (
    <div
        key={listing.id}
    >
        <div className="bg-white rounded-3xl overflow-hidden shadow-sm border border-black/5 flex flex-col relative">
            {/* Image placeholder */}
            <div className={`relative h-[220px] overflow-hidden bg-gray-100 flex items-center justify-center`}>
                <Image
                    src="/frisco-reality-sered.jpg"
                    alt={listing.title}
                    fill
                    sizes="100vw"
                    priority={priority}
                    className="object-cover opacity-90"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                <span className={`absolute top-4 left-4 ${listing.badgeColor} text-white px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider shadow-sm z-20`}>
                    {listing.badge}
                </span>

                {/* Overlay only - no text/icon */}
                <div className="absolute inset-0 bg-white/30 backdrop-blur-[1px] z-10" />
            </div>

            {/* Card content */}
            <div className="p-6 flex flex-col text-left">
                <h4 className="text-xl font-poppins font-bold text-black mb-1 leading-tight">
                    {listing.title}
                </h4>
                <h3 className="text-lg font-bold text-accent-red mb-4">
                    {listing.price}
                </h3>
                <div className="flex items-center gap-2 text-charcoal/60 text-sm mb-4">
                    <MapPin className="w-4 h-4 text-accent-red" />
                    {listing.location}
                </div>
                <div className="pt-4 border-t border-black/5 flex items-center justify-between text-black/70 text-sm">
                    <div className="flex items-center gap-2">
                        <Maximize className="w-4 h-4 text-black/40" />
                        {listing.area}
                    </div>
                    <div className="flex items-center gap-2">
                        <Home className="w-4 h-4 text-black/40" />
                        {listing.rooms}
                    </div>
                </div>
            </div>
        </div>
    </div>
);

export const MainListings = () => {
    return (
        <section
            className="pt-12 lg:pt-24 pb-12 bg-cream relative z-10 border-b border-black/5 min-h-[800px] lg:min-h-[600px]"
        >
            <div className="container mx-auto px-6">

                {/* Header */}
                <motion.div
                    className="flex justify-between items-end mb-12"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: '-50px' }}
                    transition={{ duration: 0.4, ease: "easeOut" }}
                >
                    <div>
                        <span className="text-accent-red font-bold text-sm tracking-[0.2em] uppercase mb-4 block">
                            Exkluzívny výber
                        </span>
                        <h2 className="text-4xl md:text-5xl font-serif font-extrabold text-black leading-tight tracking-tight">
                            Aktuálna ponuka
                        </h2>
                    </div>
                </motion.div>

                {/* Desktop — 3 mockup cards */}
                <motion.div
                    className="hidden lg:flex gap-8"
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: 0.15, ease: "easeOut" }}
                >
                    {MOCK_LISTINGS.map((listing, index) => (
                        <MockListingCard key={listing.id} listing={listing} index={index} />
                    ))}
                </motion.div>

                {/* Desktop CTA */}
                <motion.div
                    className="hidden lg:flex justify-center mt-12"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: 0.8, ease: [0.4, 0, 0.2, 1] }}
                >
                    <a
                        href="/ponuka"
                        className="group relative px-8 py-4 bg-navy text-white font-sans font-medium tracking-wide overflow-hidden rounded-full shadow-lg shadow-navy/10 hover:shadow-navy/20 transition-all duration-300 flex items-center gap-3"
                    >
                        <div className="absolute inset-0 w-full h-full bg-accent-red/10 group-hover:bg-accent-red transform -translate-x-full group-hover:translate-x-0 transition-transform duration-500 ease-out" />
                        <span className="relative z-10 uppercase tracking-widest text-sm font-bold">Zobraziť celú ponuku</span>
                        <ChevronRight className="relative z-10 w-4 h-4" />
                    </a>
                </motion.div>

                {/* Mobile — 2 mockup cards */}
                <div
                    className="lg:hidden flex flex-col gap-6"
                >
                    {MOCK_LISTINGS.slice(0, 2).map((listing, index) => (
                        <MockListingCardMobile key={listing.id} listing={listing} index={index} priority={true} />
                    ))}

                    <a
                        href="/ponuka"
                        className="w-full py-4 mt-4 bg-navy rounded-full text-white font-bold hover:bg-navy/90 transition-colors duration-300 uppercase tracking-widest text-sm text-center block shadow-lg shadow-navy/20"
                    >
                        Zobraziť celú ponuku
                    </a>
                </div>

            </div>
        </section>
    );
};
