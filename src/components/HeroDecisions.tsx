'use client';

import { Search, ArrowRight } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useLanguage } from '@/i18n/LanguageProvider';

export const HeroDecisions = () => {
    const router = useRouter();
    const { language } = useLanguage();

    const copy = {
        sk: {
            owners: 'Majitelia',
            ownerTitleLine1: 'Chcem predať',
            ownerTitleLine2: 'nehnuteľnosť',
            seekers: 'Kupujúci',
            seekerTitleLine1: 'Hľadám',
            seekerTitleLine2: 'nehnuteľnosť',
        },
        en: {
            owners: 'Owners',
            ownerTitleLine1: 'I want to sell',
            ownerTitleLine2: 'my property',
            seekers: 'Buyers',
            seekerTitleLine1: 'I am looking for',
            seekerTitleLine2: 'a property',
        },
        de: {
            owners: 'Eigentümer',
            ownerTitleLine1: 'Ich möchte',
            ownerTitleLine2: 'verkaufen',
            seekers: 'Käufer',
            seekerTitleLine1: 'Ich suche',
            seekerTitleLine2: 'eine Immobilie',
        },
    }[language];

    return (
        <div className="w-full">
            <div className="flex flex-col sm:flex-row gap-6 w-full story-soft stagger-4">
                {/* Option 1: Want to Sell? - Elegant White */}
                <button
                    onClick={() => router.push('/kontakt')}
                    className="
                        group relative flex-1 flex items-center justify-between px-8 py-7
                        bg-white/80 backdrop-blur-md border border-navy/5 shadow-[0_8px_30px_rgb(10,24,40,0.04)]
                        hover:shadow-[0_20px_40px_rgb(10,24,40,0.08)] hover:border-navy/10 hover:-translate-y-1
                        rounded-[2rem] transition-all duration-500 overflow-hidden text-left
                    "
                >
                    <div className="absolute inset-0 bg-gradient-to-tr from-white to-gray-50 opacity-100 group-hover:opacity-0 transition-opacity duration-500" />
                    <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                    <div className="relative z-10">
                        <span className="block text-navy/40 text-[10px] font-bold tracking-[0.25em] uppercase mb-3 ml-0.5 group-hover:text-navy/60 transition-colors duration-300">
                            {copy.owners}
                        </span>
                        <div className="relative overflow-hidden">
                            <span className="block text-2xl font-serif font-medium text-navy tracking-tight group-hover:translate-y-[-2px] transition-transform duration-500">
                                {copy.ownerTitleLine1}
                                <br />{copy.ownerTitleLine2}
                            </span>
                        </div>
                    </div>

                    <div className="relative z-10 w-12 h-12 rounded-full border border-navy/5 bg-white flex items-center justify-center text-navy/40 group-hover:bg-navy group-hover:text-white group-hover:scale-110 group-hover:shadow-lg transition-all duration-500">
                        <ArrowRight className="w-5 h-5 group-hover:translate-x-0.5 transition-transform duration-500" />
                    </div>
                </button>

                {/* Option 2: Looking to Buy? - Deep Navy Premium */}
                <button
                    onClick={() => router.push('/ponuka')}
                    className="
                        group relative flex-1 flex items-center justify-between px-8 py-7
                        bg-navy shadow-[0_8px_30px_rgb(10,24,40,0.2)]
                        hover:shadow-[0_20px_40px_rgb(10,24,40,0.4)] hover:-translate-y-1
                        rounded-[2rem] transition-all duration-500 overflow-hidden text-left
                    "
                >
                    {/* Subtle Gradient Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-br from-navy via-navy to-[#0a1525] transition-all duration-500" />
                    <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-10 mix-blend-soft-light" />

                    <div className="relative z-10">
                        <span className="block text-white/40 text-[10px] font-bold tracking-[0.25em] uppercase mb-3 ml-0.5 group-hover:text-white/60 transition-colors duration-300">
                            {copy.seekers}
                        </span>
                        <div className="relative overflow-hidden">
                            <span className="block text-2xl font-serif font-medium text-white tracking-tight group-hover:translate-y-[-2px] transition-transform duration-500">
                                {copy.seekerTitleLine1}
                                <br />{copy.seekerTitleLine2}
                            </span>
                        </div>
                    </div>

                    <div className="relative z-10 w-12 h-12 rounded-full border border-white/10 bg-white/5 flex items-center justify-center text-white group-hover:bg-white group-hover:text-navy group-hover:scale-110 group-hover:shadow-xl group-hover:shadow-white/10 transition-all duration-500">
                        <Search className="w-5 h-5" />
                    </div>
                </button>
            </div>
        </div>
    );
};
