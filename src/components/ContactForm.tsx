'use client';

import { useState } from 'react';
import { ArrowUpRight, ArrowRight } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export const ContactForm = () => {
    const { toast } = useToast();
    const [formState, setFormState] = useState({
        name: '',
        email: '',
        phone: '',
        message: ''
    });
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            const res = await fetch('/api/contact', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formState),
            });
            if (!res.ok) throw new Error('Failed');
            toast({
                title: "Správa odoslaná",
                description: "Ozveme sa vám čoskoro.",
            });
            setFormState({ name: '', email: '', phone: '', message: '' });
        } catch {
            toast({
                title: "Chyba pri odosielaní",
                description: "Skúste to prosím znova alebo nás kontaktujte priamo.",
                variant: "destructive",
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="relative p-8 md:p-10 rounded-3xl bg-white border border-navy/10 shadow-lg">
            {/* Decorative corner accent */}
            <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-navy/10 to-transparent rounded-tr-3xl pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-navy/5 to-transparent rounded-bl-3xl pointer-events-none" />

            <div className="mb-8">
                <span className="text-navy font-mono text-[10px] tracking-[0.3em] uppercase">Kontaktný formulár</span>
                <h3 className="text-2xl md:text-3xl font-poppins font-extrabold text-navy mt-2 leading-tight">
                    Don&apos;t hesitate to{' '}
                    <span className="font-serif italic font-normal text-accent-red">contact us</span>
                </h3>
                <p className="text-charcoal/50 text-sm mt-2 font-sans">
                    Odpovieme vám do 24 hodín — nezáväzne a diskrétne.
                </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormInput
                        label="Meno"
                        type="text"
                        placeholder="Vaše meno"
                        value={formState.name}
                        onChange={(value) => setFormState({ ...formState, name: value })}
                        required
                    />
                    <FormInput
                        label="Telefón"
                        type="tel"
                        placeholder="+421 XXX XXX XXX"
                        value={formState.phone}
                        onChange={(value) => setFormState({ ...formState, phone: value })}
                    />
                </div>

                <FormInput
                    label="Email"
                    type="email"
                    placeholder="vas@email.sk"
                    value={formState.email}
                    onChange={(value) => setFormState({ ...formState, email: value })}
                    required
                />

                <div>
                    <label className="block text-charcoal/60 text-xs uppercase tracking-widest mb-3">
                        Správa
                    </label>
                    <textarea
                        rows={4}
                        required
                        value={formState.message}
                        onChange={e => setFormState({ ...formState, message: e.target.value })}
                        placeholder="Ako vám môžeme pomôcť?"
                        className="w-full bg-cream/50 border border-navy/10 rounded-xl px-4 py-3 text-base text-charcoal placeholder:text-charcoal/30 focus:outline-none focus:border-navy/30 focus:bg-white transition-all duration-300 resize-none font-sans"
                    />
                </div>

                <button
                    type="submit"
                    disabled={isSubmitting}
                    className="group relative w-full inline-flex items-center justify-center gap-3 px-8 py-4 bg-accent-red text-white rounded-full overflow-hidden hover:bg-accent-red/90 transition-all duration-500 disabled:opacity-50 disabled:pointer-events-none shadow-lg shadow-accent-red/20"
                >
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />

                    <span className="relative z-10 text-sm font-bold tracking-widest uppercase">
                        {isSubmitting ? 'Odosielam...' : 'Odoslať správu'}
                    </span>
                    <ArrowUpRight className="relative z-10 w-4 h-4 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
                </button>

                <p className="text-charcoal/40 text-xs text-center mt-4">
                    Vaše údaje sú v bezpečí. Odpovieme do 24 hodín.
                </p>
            </form>
        </div>
    );
};

const FormInput = ({
    label,
    type,
    placeholder,
    value,
    onChange,
    required = false
}: {
    label: string;
    type: string;
    placeholder: string;
    value: string;
    onChange: (value: string) => void;
    required?: boolean;
}) => (
    <div>
        <label className="block text-charcoal/60 text-xs uppercase tracking-widest mb-3">
            {label}
        </label>
        <input
            type={type}
            required={required}
            value={value}
            onChange={e => onChange(e.target.value)}
            placeholder={placeholder}
            className="w-full bg-cream/50 border border-navy/10 rounded-xl px-4 py-3 text-base text-charcoal placeholder:text-charcoal/30 focus:outline-none focus:border-navy/30 focus:bg-white transition-all duration-300 font-sans"
        />
    </div>
);
