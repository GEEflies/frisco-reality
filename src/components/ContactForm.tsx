'use client';

import { useState } from 'react';
import { ArrowUpRight } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { LocaleLink } from './LocaleLink';
import { useLanguage } from '@/i18n/LanguageProvider';
import type { LanguageCode } from '@/i18n/types';

const formCopy: Record<LanguageCode, {
    formLabel: string;
    heading: string;
    headingAccent: string;
    headingAccentMobile: string;
    subtext: string;
    nameLabel: string;
    namePlaceholder: string;
    phoneLabel: string;
    emailLabel: string;
    emailPlaceholder: string;
    messageLabel: string;
    messagePlaceholder: string;
    submitting: string;
    submit: string;
    privacy: string;
    privacyLinkLabel: string;
    successTitle: string;
    successDesc: string;
    errorTitle: string;
    errorDesc: string;
}> = {
    sk: {
        formLabel: 'Kontaktný formulár',
        heading: 'Máte otázku?',
        headingAccent: 'Ozvite sa nám',
        headingAccentMobile: 'Ozvite sa',
        subtext: 'Odpovieme vám do 24 hodín — nezáväzne a diskrétne.',
        nameLabel: 'Meno',
        namePlaceholder: 'Vaše meno',
        phoneLabel: 'Telefón',
        emailLabel: 'Email',
        emailPlaceholder: 'vas@email.sk',
        messageLabel: 'Správa',
        messagePlaceholder: 'Ako vám môžeme pomôcť?',
        submitting: 'Odosielam...',
        submit: 'Odoslať správu',
        privacy: 'Odoslaním formulára beriete na vedomie spracúvanie osobných údajov podľa',
        privacyLinkLabel: 'Zásad ochrany osobných údajov',
        successTitle: 'Správa odoslaná',
        successDesc: 'Ozveme sa vám čoskoro.',
        errorTitle: 'Chyba pri odosielaní',
        errorDesc: 'Skúste to prosím znova alebo nás kontaktujte priamo.',
    },
    en: {
        formLabel: 'Contact form',
        heading: 'Have a question?',
        headingAccent: 'Reach out to us',
        headingAccentMobile: 'Reach out',
        subtext: 'We respond within 24 hours — with no obligation and full discretion.',
        nameLabel: 'Name',
        namePlaceholder: 'Your name',
        phoneLabel: 'Phone',
        emailLabel: 'Email',
        emailPlaceholder: 'your@email.com',
        messageLabel: 'Message',
        messagePlaceholder: 'How can we help you?',
        submitting: 'Sending...',
        submit: 'Send message',
        privacy: 'By submitting this form, you acknowledge personal data processing under our',
        privacyLinkLabel: 'Privacy Policy',
        successTitle: 'Message sent',
        successDesc: 'We will get back to you shortly.',
        errorTitle: 'Error sending message',
        errorDesc: 'Please try again or contact us directly.',
    },
    de: {
        formLabel: 'Kontaktformular',
        heading: 'Haben Sie eine Frage?',
        headingAccent: 'Melden Sie sich bei uns',
        headingAccentMobile: 'Melden Sie sich',
        subtext: 'Wir antworten innerhalb von 24 Stunden — unverbindlich und diskret.',
        nameLabel: 'Name',
        namePlaceholder: 'Ihr Name',
        phoneLabel: 'Telefon',
        emailLabel: 'E-Mail',
        emailPlaceholder: 'ihre@email.de',
        messageLabel: 'Nachricht',
        messagePlaceholder: 'Wie können wir Ihnen helfen?',
        submitting: 'Wird gesendet...',
        submit: 'Nachricht senden',
        privacy: 'Mit dem Absenden des Formulars bestätigen Sie die Verarbeitung personenbezogener Daten gemäß unserer',
        privacyLinkLabel: 'Datenschutzerklärung',
        successTitle: 'Nachricht gesendet',
        successDesc: 'Wir melden uns in Kürze bei Ihnen.',
        errorTitle: 'Fehler beim Senden',
        errorDesc: 'Bitte versuchen Sie es erneut oder kontaktieren Sie uns direkt.',
    },
};

export const ContactForm = () => {
    const { language } = useLanguage();
    const { toast } = useToast();
    const t = formCopy[language];
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
                title: t.successTitle,
                description: t.successDesc,
            });
            setFormState({ name: '', email: '', phone: '', message: '' });
        } catch {
            toast({
                title: t.errorTitle,
                description: t.errorDesc,
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
                <span className="text-navy font-mono text-[10px] tracking-[0.3em] uppercase">{t.formLabel}</span>
                <h3 className="text-2xl md:text-3xl font-poppins font-extrabold text-navy mt-2 leading-tight">
                    {t.heading}{language === 'de' ? <br /> : ' '}
                    <span className="font-serif italic font-normal text-accent-red">
                        <span className="md:hidden">{t.headingAccentMobile}</span>
                        <span className="hidden md:inline">{t.headingAccent}</span>
                    </span>
                </h3>
                <p className="text-charcoal/50 text-sm mt-2 font-sans">
                    {t.subtext}
                </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormInput
                        label={t.nameLabel}
                        type="text"
                        placeholder={t.namePlaceholder}
                        value={formState.name}
                        onChange={(value) => setFormState({ ...formState, name: value })}
                        required
                    />
                    <FormInput
                        label={t.phoneLabel}
                        type="tel"
                        placeholder="+421 XXX XXX XXX"
                        value={formState.phone}
                        onChange={(value) => setFormState({ ...formState, phone: value })}
                    />
                </div>

                <FormInput
                    label={t.emailLabel}
                    type="email"
                    placeholder={t.emailPlaceholder}
                    value={formState.email}
                    onChange={(value) => setFormState({ ...formState, email: value })}
                    required
                />

                <div>
                    <label className="block text-charcoal/60 text-xs uppercase tracking-widest mb-3">
                        {t.messageLabel}
                    </label>
                    <textarea
                        rows={4}
                        required
                        value={formState.message}
                        onChange={e => setFormState({ ...formState, message: e.target.value })}
                        placeholder={t.messagePlaceholder}
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
                        {isSubmitting ? t.submitting : t.submit}
                    </span>
                    <ArrowUpRight className="relative z-10 w-4 h-4 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
                </button>

                <p className="text-charcoal/45 text-xs text-center mt-4">
                    {t.privacy}{' '}
                    <LocaleLink href="/ochrana-osobnych-udajov" className="underline underline-offset-2 hover:text-accent-red transition-colors">
                        {t.privacyLinkLabel}
                    </LocaleLink>
                    .
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
