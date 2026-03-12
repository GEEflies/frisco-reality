'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, Search, Building2, Home } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useLanguage } from '@/i18n/LanguageProvider';
import { useIsDesktop } from '@/hooks/useIsDesktop';
import { localePath } from '@/i18n/types';

export const HeroActionWidget = () => {
    const [activeTab, setActiveTab] = useState<'buy' | 'sell'>('buy');
    const { language } = useLanguage();
    const router = useRouter();
    const isDesktop = useIsDesktop();

    const copy = {
        sk: {
            buyer: 'Kupujúci',
            owner: 'Majiteľ',
            buyTitle: 'Nájdite svoj domov',
            buyText: 'Prezrite si našu exkluzívnu ponuku luxusných nehnuteľností v Bratislave a okolí.',
            browse: 'Prezerať ponuku',
            sellTitle: 'Predajte s gráciou',
            sellText: 'Získajte profesionálnu valuáciu a kompletný servis pri predaji vašej nehnuteľnosti.',
            sellCta: 'Chcem predať',
        },
        en: {
            buyer: 'Buyer',
            owner: 'Owner',
            buyTitle: 'Find your home',
            buyText: 'Browse our exclusive portfolio of premium properties in Bratislava and nearby areas.',
            browse: 'Browse listings',
            sellTitle: 'Sell with confidence',
            sellText: 'Get a professional valuation and full service for selling your property.',
            sellCta: 'I want to sell',
        },
        de: {
            buyer: 'Käufer',
            owner: 'Eigentümer',
            buyTitle: 'Finden Sie Ihr Zuhause',
            buyText: 'Entdecken Sie unser exklusives Angebot an Premium-Immobilien in Bratislava und Umgebung.',
            browse: 'Angebote ansehen',
            sellTitle: 'Verkaufen mit Stil',
            sellText: 'Erhalten Sie eine professionelle Bewertung und kompletten Service beim Verkauf Ihrer Immobilie.',
            sellCta: 'Ich möchte verkaufen',
        },
    }[language];

    return (
        <div className="w-full max-w-md bg-white/80 backdrop-blur-xl border border-white/20 shadow-[0_8px_30px_rgb(0,0,0,0.04)] rounded-[2rem] p-2 overflow-hidden">
            {/* Tab Switcher */}
            <div className="relative flex p-1 bg-navy/5 rounded-[1.5rem] mb-6">
                <div
                    className={`absolute inset-y-1 w-1/2 bg-white rounded-[1.2rem] shadow-sm transition-all duration-300 ease-out ${activeTab === 'sell' ? 'translate-x-[100%]' : 'translate-x-0'
                        }`}
                />
                <button
                    onClick={() => setActiveTab('buy')}
                    className={`relative z-10 flex-1 flex items-center justify-center gap-2 py-3 text-sm font-medium transition-colors duration-300 ${activeTab === 'buy' ? 'text-navy' : 'text-navy/50 hover:text-navy/70'
                        }`}
                >
                    <Search className="w-4 h-4" />
                    <span>{copy.buyer}</span>
                </button>
                <button
                    onClick={() => setActiveTab('sell')}
                    className={`relative z-10 flex-1 flex items-center justify-center gap-2 py-3 text-sm font-medium transition-colors duration-300 ${activeTab === 'sell' ? 'text-navy' : 'text-navy/50 hover:text-navy/70'
                        }`}
                >
                    <Building2 className="w-4 h-4" />
                    <span>{copy.owner}</span>
                </button>
            </div>

            {/* Content Area */}
            <div className="px-4 pb-4">
                <AnimatePresence mode="wait">
                    {activeTab === 'buy' ? (
                        <motion.div
                            key="buy"
                            {...(isDesktop ? {
                                initial: { opacity: 0, y: 10 },
                                animate: { opacity: 1, y: 0 },
                                exit: { opacity: 0, y: -10 },
                                transition: { duration: 0.2 },
                            } : {
                                initial: false,
                            })}
                            className="space-y-4"
                        >
                            <div className="space-y-2">
                                <h3 className="text-2xl font-serif text-navy">{copy.buyTitle}</h3>
                                <p className="text-sm text-navy/60 leading-relaxed">
                                    {copy.buyText}
                                </p>
                            </div>

                            <button
                                onClick={() => router.push(localePath('/ponuka', language))}
                                className="w-full group bg-navy text-white rounded-[1.2rem] py-4 px-6 flex items-center justify-between hover:bg-navy/90 transition-all duration-300 shadow-lg shadow-navy/20 hover:shadow-xl hover:-translate-y-0.5"
                            >
                                <span className="font-medium">{copy.browse}</span>
                                <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center border border-white/10 group-hover:bg-white group-hover:text-navy transition-colors">
                                    <ArrowRight className="w-4 h-4" />
                                </div>
                            </button>
                        </motion.div>
                    ) : (
                        <motion.div
                            key="sell"
                            {...(isDesktop ? {
                                initial: { opacity: 0, y: 10 },
                                animate: { opacity: 1, y: 0 },
                                exit: { opacity: 0, y: -10 },
                                transition: { duration: 0.2 },
                            } : {
                                initial: false,
                            })}
                            className="space-y-4"
                        >
                            <div className="space-y-2">
                                <h3 className="text-2xl font-serif text-navy">{copy.sellTitle}</h3>
                                <p className="text-sm text-navy/60 leading-relaxed">
                                    {copy.sellText}
                                </p>
                            </div>

                            <button
                                onClick={() => router.push(localePath('/predaj-a-prenajom', language))}
                                className="w-full group bg-white border border-navy/10 text-navy rounded-[1.2rem] py-4 px-6 flex items-center justify-between hover:border-navy/20 hover:bg-gray-50 transition-all duration-300 shadow-sm hover:shadow-md hover:-translate-y-0.5"
                            >
                                <span className="font-medium">{copy.sellCta}</span>
                                <div className="w-8 h-8 rounded-full bg-navy/5 flex items-center justify-center border border-navy/10 group-hover:bg-navy group-hover:text-white transition-colors">
                                    <ArrowRight className="w-4 h-4" />
                                </div>
                            </button>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
};
