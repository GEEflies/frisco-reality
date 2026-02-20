'use client';

import { ArrowUpRight } from 'lucide-react';

interface ManifestoFeature {
    id: string;
    icon: any;
    title: string;
    description: string;
    stat: string;
    statLabel: string;
    color: string;
}

interface ManifestoSectionProps {
    id?: string;
    label: string;
    title: React.ReactNode;
    description?: string;
    features: ManifestoFeature[];
    cta?: {
        href: string;
        text: string;
    };
}

export const ManifestoSection = ({ id, label, title, description, features, cta }: ManifestoSectionProps) => {
    return (
        <section id={id} className="relative bg-white py-24 overflow-hidden">
            {/* Background Noise/Texture */}
            <div className="absolute inset-0 bg-noise opacity-5 mix-blend-soft-light will-change-auto" />

            <div className="container mx-auto px-6 md:px-12 relative z-10">
                <div className="flex flex-col lg:flex-row gap-16 lg:gap-24">

                    {/* Left Column - Intro */}
                    <div className="w-full lg:w-5/12">
                        <span className="block text-navy font-mono text-sm tracking-[0.2em] mb-4 uppercase">
                            {label}
                        </span>
                        <h2 className="text-5xl md:text-7xl font-serif font-bold text-navy leading-tight md:leading-[0.9] tracking-tighter mb-8">
                            {title}
                        </h2>
                        {description && (
                            <p className="text-charcoal/70 text-lg md:text-xl leading-relaxed mb-12 max-w-xl">
                                {description}
                            </p>
                        )}

                        {cta && (
                            <a href={cta.href} className="group inline-flex items-center gap-4 text-navy hover:text-accent-red transition-colors duration-300 cursor-pointer">
                                <span className="text-sm font-medium tracking-widest uppercase border-b border-navy/20 group-hover:border-accent-red pb-1">{cta.text}</span>
                                <ArrowUpRight className="w-5 h-5 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
                            </a>
                        )}
                    </div>

                    {/* Right Column - Infinite Marquee (Treadmill) */}
                    <div className="w-full lg:w-7/12 relative overflow-hidden mask-fade-sides">
                        {/* Gradient Masks for fading edges */}
                        <div className="absolute inset-y-0 left-0 w-12 bg-gradient-to-r from-white to-transparent z-10" />
                        <div className="absolute inset-y-0 right-0 w-12 bg-gradient-to-l from-white to-transparent z-10" />

                        <div
                            className="flex gap-6 w-max animate-marquee hover:[animation-play-state:paused]"
                            style={{ cursor: 'grab' }}
                        >
                            {/* Duplicate features multiple times for smooth infinite loop */}
                            {[...features, ...features, ...features, ...features].map((feature, index) => (
                                <div
                                    key={`${feature.id}-${index}`}
                                    className="w-[300px] md:w-[320px] shrink-0 bg-white border border-navy/10 p-6 rounded-3xl shadow-sm hover:shadow-md transition-shadow duration-300 select-none"
                                >
                                    <div className={`w-12 h-12 rounded-2xl ${feature.color} flex items-center justify-center mb-5 text-navy border border-navy/5`}>
                                        <feature.icon className="w-6 h-6" strokeWidth={1.5} />
                                    </div>
                                    <h3 className="text-xl font-serif font-bold text-navy mb-2">{feature.title}</h3>
                                    <p className="text-charcoal/70 mb-6 leading-relaxed text-base">{feature.description}</p>

                                    <div className="flex items-baseline gap-2 pt-3 border-t border-navy/5">
                                        <span className="text-2xl font-light text-navy">{feature.stat}</span>
                                        <span className="text-xs text-charcoal/40 uppercase tracking-widest">{feature.statLabel}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                </div>
            </div>
        </section>
    );
};
