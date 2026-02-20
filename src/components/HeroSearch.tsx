'use client';

import { Building2, Home, Map, Key, Warehouse } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useLanguage } from '@/i18n/LanguageProvider';

export const HeroSearch = ({ className = "" }: { className?: string }) => {
    const { language } = useLanguage();
    const router = useRouter();

    const labels = {
        sk: { apartment: 'BYTY', house: 'DOMY', land: 'POZEMKY', rent: 'PRENÁJOM', other: 'INÉ' },
        en: { apartment: 'APARTMENTS', house: 'HOUSES', land: 'LAND', rent: 'RENT', other: 'OTHER' },
        de: { apartment: 'WOHNUNGEN', house: 'HÄUSER', land: 'GRUNDSTÜCKE', rent: 'MIETE', other: 'SONSTIGES' },
    }[language];

    const categories = [
        { id: 'apartment', label: labels.apartment, icon: Building2, params: { category: 'apartment' } },
        { id: 'house', label: labels.house, icon: Home, params: { category: 'house' } },
        { id: 'land', label: labels.land, icon: Map, params: { category: 'land' } },
        { id: 'rent', label: labels.rent, icon: Key, params: { type: 'rent' } },
        { id: 'other', label: labels.other, icon: Warehouse, params: { category: 'other' } },
    ];

    const handleSearch = (params: any) => {
        const searchParams = new URLSearchParams(params);
        router.push(`/ponuka?${searchParams.toString()}`);
    };

    const row1 = categories.slice(0, 3);
    const row2 = categories.slice(3);

    return (
        <div className={`w-full ${className}`}>
            <div
                className="flex flex-col md:flex-row items-center justify-center gap-3 md:gap-2 story-soft stagger-3"
            >
                {/* Row 1: Byty, Domy, Pozemky */}
                <div className="flex items-center justify-center gap-2">
                    {row1.map((item) => (
                        <button
                            key={item.id}
                            onClick={() => handleSearch(item.params)}
                            className="group relative flex items-center justify-center gap-2 px-5 py-3 rounded-full bg-white border border-navy/10 shadow-sm hover:bg-navy hover:border-navy hover:shadow-md transition-all duration-300 flex-shrink-0"
                        >
                            <item.icon className="w-4 h-4 text-navy/70 group-hover:text-white transition-colors" strokeWidth={1.5} />
                            <span className="text-[10px] font-medium tracking-widest text-navy/70 group-hover:text-white uppercase whitespace-nowrap">
                                {item.label}
                            </span>
                        </button>
                    ))}
                </div>

                {/* Row 2: Prenájom, Iné */}
                <div className="flex items-center justify-center gap-2">
                    {row2.map((item) => (
                        <button
                            key={item.id}
                            onClick={() => handleSearch(item.params)}
                            className="group relative flex items-center justify-center gap-2 px-5 py-3 rounded-full bg-white border border-navy/10 shadow-sm hover:bg-navy hover:border-navy hover:shadow-md transition-all duration-300 flex-shrink-0"
                        >
                            <item.icon className="w-4 h-4 text-navy/70 group-hover:text-white transition-colors" strokeWidth={1.5} />
                            <span className="text-[10px] font-medium tracking-widest text-navy/70 group-hover:text-white uppercase whitespace-nowrap">
                                {item.label}
                            </span>
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
};
