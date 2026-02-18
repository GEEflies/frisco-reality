'use client';

import { motion } from 'framer-motion';
import { Building2, Home, Map, Key, Warehouse } from 'lucide-react';
import { useRouter } from 'next/navigation';

const categories = [
    { id: 'apartment', label: 'BYTY', icon: Building2, params: { category: 'apartment' } },
    { id: 'house', label: 'DOMY', icon: Home, params: { category: 'house' } },
    { id: 'land', label: 'POZEMKY', icon: Map, params: { category: 'land' } },
    { id: 'rent', label: 'PRENÁJOM', icon: Key, params: { type: 'rent' } },
    { id: 'other', label: 'INÉ', icon: Warehouse, params: { category: 'other' } },
];

export const HeroSearch = ({ className = "" }: { className?: string }) => {
    const router = useRouter();

    const handleSearch = (params: any) => {
        const searchParams = new URLSearchParams(params);
        router.push(`/ponuka?${searchParams.toString()}`);
    };

    const row1 = categories.slice(0, 3);
    const row2 = categories.slice(3);

    return (
        <div className={`w-full ${className}`}>
            <motion.div
                className="flex flex-col md:flex-row items-center justify-center gap-3 md:gap-2"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.8 }}
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
            </motion.div>
        </div>
    );
};
