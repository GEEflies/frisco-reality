'use client';

import { motion } from 'framer-motion';
import { useState } from 'react';
import { MapPin, Phone, Mail, Instagram, Facebook, Send, ArrowUpRight } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export const ContactSection = () => {
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
    await new Promise(resolve => setTimeout(resolve, 1500));
    setIsSubmitting(false);
    toast({
      title: "Správa odoslaná",
      description: "Ozveme sa vám čoskoro.",
    });
    setFormState({ name: '', email: '', phone: '', message: '' });
  };

  return (
    <section id="kontakt" className="relative bg-cream overflow-hidden contain-layout">

      {/* Subtle background texture */}
      <div className="absolute inset-0 bg-noise opacity-5 mix-blend-soft-light pointer-events-none" />

      {/* Decorative gradient blobs */}
      <div className="absolute -top-20 -right-20 w-[450px] h-[450px] bg-accent-red/[0.05] rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute -bottom-20 -left-20 w-[350px] h-[350px] bg-navy/[0.04] rounded-full blur-[100px] pointer-events-none" />

      <div className="container mx-auto max-w-[1200px] px-6 py-16 md:py-20 relative z-10">

        {/* Section Header */}
        <div className="mb-10 md:mb-14">
          <motion.span
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4 }}
            className="block text-accent-red font-sans text-xs font-semibold tracking-[0.2em] uppercase mb-3"
          >
            Kontakt
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: 0.05 }}
            className="text-3xl md:text-4xl font-sans font-bold text-navy tracking-tight"
          >
            Dohodnite si s nami stretnutie
          </motion.h2>
        </div>

        <div className="flex flex-col lg:flex-row gap-8 lg:gap-10">

          {/* Left: Contact Info */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: 0.05 }}
            className="w-full lg:w-[42%] flex flex-col gap-4"
          >
            {/* Address Card */}
            <div
              className="flex items-start gap-4 p-5 rounded-2xl bg-white border border-navy/[0.06] transition-all duration-300"
            >
              <div className="w-10 h-10 rounded-xl bg-accent-red/8 flex items-center justify-center shrink-0 transition-colors duration-300">
                <MapPin className="w-[18px] h-[18px] text-accent-red" strokeWidth={1.8} />
              </div>
              <div className="flex-1 min-w-0">
                <span className="block text-navy/35 text-[10px] font-sans font-semibold uppercase tracking-[0.15em] mb-1.5">Kancelária</span>
                <span className="block text-navy font-sans font-medium text-sm leading-relaxed">
                  Námestie Slobody 30/1185
                </span>
                <span className="block text-charcoal/50 font-sans text-sm">926 01 Sereď</span>
              </div>
            </div>

            {/* Phone Card */}
            <a
              href="tel:+421905447220"
              className="group flex items-start gap-4 p-5 rounded-2xl bg-white border border-navy/[0.06] hover:border-accent-red/20 hover:shadow-lg hover:shadow-accent-red/[0.04] transition-all duration-300"
            >
              <div className="w-10 h-10 rounded-xl bg-accent-red/8 group-hover:bg-accent-red/15 flex items-center justify-center shrink-0 transition-colors duration-300">
                <Phone className="w-[18px] h-[18px] text-accent-red" strokeWidth={1.8} />
              </div>
              <div className="flex-1 min-w-0">
                <span className="block text-navy/35 text-[10px] font-sans font-semibold uppercase tracking-[0.15em] mb-1.5">Zavolajte nám</span>
                <span className="block text-navy font-sans font-semibold text-base tracking-wide">0905 447 220</span>
              </div>
              <ArrowUpRight className="w-4 h-4 text-navy/15 group-hover:text-accent-red ml-auto mt-1 shrink-0 transition-all duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </a>

            {/* Email Card */}
            <a
              href="mailto:info@frisco.sk"
              className="group flex items-start gap-4 p-5 rounded-2xl bg-white border border-navy/[0.06] hover:border-accent-red/20 hover:shadow-lg hover:shadow-accent-red/[0.04] transition-all duration-300"
            >
              <div className="w-10 h-10 rounded-xl bg-accent-red/8 group-hover:bg-accent-red/15 flex items-center justify-center shrink-0 transition-colors duration-300">
                <Mail className="w-[18px] h-[18px] text-accent-red" strokeWidth={1.8} />
              </div>
              <div className="flex-1 min-w-0">
                <span className="block text-navy/35 text-[10px] font-sans font-semibold uppercase tracking-[0.15em] mb-1.5">Napíšte nám</span>
                <span className="block text-navy font-sans font-medium text-sm">info@frisco.sk</span>
              </div>
              <ArrowUpRight className="w-4 h-4 text-navy/15 group-hover:text-accent-red ml-auto mt-1 shrink-0 transition-all duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </a>

            {/* Social Links */}
            <div className="flex items-center gap-3 pt-2">
              <span className="text-navy/25 text-[10px] font-sans font-semibold uppercase tracking-[0.15em] mr-1">Sledujte nás</span>
              <a
                href="https://www.instagram.com/friscoreality/"
                target="_blank"
                rel="noopener noreferrer"
                className="group w-10 h-10 rounded-xl border border-navy/10 hover:border-accent-red/30 flex items-center justify-center hover:bg-accent-red hover:shadow-lg hover:shadow-accent-red/15 transition-all duration-300"
              >
                <Instagram className="w-[18px] h-[18px] text-navy/40 group-hover:text-white transition-colors duration-300" strokeWidth={1.8} />
              </a>
              <a
                href="https://www.facebook.com/Friscorealitka/"
                target="_blank"
                rel="noopener noreferrer"
                className="group w-10 h-10 rounded-xl border border-navy/10 hover:border-accent-red/30 flex items-center justify-center hover:bg-accent-red hover:shadow-lg hover:shadow-accent-red/15 transition-all duration-300"
              >
                <Facebook className="w-[18px] h-[18px] text-navy/40 group-hover:text-white transition-colors duration-300" strokeWidth={1.8} />
              </a>
            </div>
          </motion.div>

          {/* Right: Form */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: 0.1 }}
            className="w-full lg:w-[58%]"
          >
            <div className="relative p-6 md:p-8 rounded-2xl bg-white border border-navy/[0.06] shadow-sm">
              <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-navy/10 to-transparent rounded-tr-3xl pointer-events-none" />
              <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-navy/5 to-transparent rounded-bl-3xl pointer-events-none" />

              <div className="mb-8">
                <span className="text-navy font-mono text-[10px] tracking-[0.3em] uppercase">Kontaktný formulár</span>
                <h3 className="text-2xl md:text-3xl font-serif font-bold text-navy mt-2">
                  Pošlite nám správu
                </h3>
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
                  <label className="block text-charcoal/50 text-[10px] uppercase tracking-widest mb-3">
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
          </motion.div>

        </div>
      </div>
    </section>
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
    <label className="block text-charcoal/50 text-[10px] uppercase tracking-widest mb-3">
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
