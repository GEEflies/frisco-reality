'use client';

import { motion } from 'framer-motion';
import { Search, Building2, ArrowRight } from 'lucide-react';
import { useRouter } from 'next/navigation';

export const HeroDecisions = () => {
    const router = useRouter();

    const containerVariants = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: {
                staggerChildren: 0.2,
                delayChildren: 0.4
            }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 30 },
        show: {
            opacity: 1,
            y: 0,
            transition: {
                duration: 0.8,
                ease: [0.25, 0.46, 0.45, 0.94] as any
            }
        }
    };

    return (
        <div className="w-full">
            <motion.div
                className="flex flex-col sm:flex-row gap-6 w-full"
                variants={containerVariants}
                initial="hidden"
                animate="show"
            >
                {/* Option 1: Want to Sell? - Elegant White */}
                <motion.button
                    variants={itemVariants}
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
                            Majitelia
                        </span>
                        <div className="relative overflow-hidden">
                            <span className="block text-2xl font-serif font-medium text-navy tracking-tight group-hover:translate-y-[-2px] transition-transform duration-500">
                                Chcem predať
                                <br />nehnuteľnosť
                            </span>
                        </div>
                    </div>

                    <div className="relative z-10 w-12 h-12 rounded-full border border-navy/5 bg-white flex items-center justify-center text-navy/40 group-hover:bg-navy group-hover:text-white group-hover:scale-110 group-hover:shadow-lg transition-all duration-500">
                        <ArrowRight className="w-5 h-5 group-hover:translate-x-0.5 transition-transform duration-500" />
                    </div>
                </motion.button>

                {/* Option 2: Looking to Buy? - Deep Navy Premium */}
                <motion.button
                    variants={itemVariants}
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
                            Kupujúci
                        </span>
                        <div className="relative overflow-hidden">
                            <span className="block text-2xl font-serif font-medium text-white tracking-tight group-hover:translate-y-[-2px] transition-transform duration-500">
                                Hľadám
                                <br />nehnuteľnosť
                            </span>
                        </div>
                    </div>

                    <div className="relative z-10 w-12 h-12 rounded-full border border-white/10 bg-white/5 flex items-center justify-center text-white group-hover:bg-white group-hover:text-navy group-hover:scale-110 group-hover:shadow-xl group-hover:shadow-white/10 transition-all duration-500">
                        <Search className="w-5 h-5" />
                    </div>
                </motion.button>
            </motion.div>
        </div>
    );
};
