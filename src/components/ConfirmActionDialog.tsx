'use client';

import { useEffect, useCallback } from 'react';
import { Phone, Mail, X } from 'lucide-react';
import { useLanguage } from '@/i18n/LanguageProvider';

type ActionType = 'call' | 'email';

interface ConfirmActionDialogProps {
  isOpen: boolean;
  onClose: () => void;
  actionType: ActionType;
}

const DIALOG_COPY: Record<string, Record<ActionType, { title: string; message: string; detail: string; confirm: string; cancel: string }>> = {
  sk: {
    call: {
      title: 'Chcete nám zavolať?',
      message: 'Radi Vám poradíme s čímkoľvek ohľadom nehnuteľností.',
      detail: 'Kliknutím budete presmerovaný/á na hovor s číslom 0905 447 220.',
      confirm: 'Zavolať teraz',
      cancel: 'Neskôr',
    },
    email: {
      title: 'Napíšte nám',
      message: 'Odpovieme Vám najneskôr do 24 hodín — zvyčajne oveľa skôr.',
      detail: 'Otvorí sa Vaša e-mailová aplikácia s adresou info@frisco.sk.',
      confirm: 'Napísať e-mail',
      cancel: 'Neskôr',
    },
  },
  en: {
    call: {
      title: 'Want to give us a call?',
      message: 'We are happy to help with anything related to real estate.',
      detail: 'You will be redirected to call 0905 447 220.',
      confirm: 'Call now',
      cancel: 'Maybe later',
    },
    email: {
      title: 'Send us an email',
      message: 'We typically reply within a few hours — 24h at most.',
      detail: 'Your email app will open with our address info@frisco.sk.',
      confirm: 'Write an email',
      cancel: 'Maybe later',
    },
  },
  de: {
    call: {
      title: 'Möchten Sie uns anrufen?',
      message: 'Wir beraten Sie gerne zu allen Immobilienfragen.',
      detail: 'Sie werden zum Anruf unter 0905 447 220 weitergeleitet.',
      confirm: 'Jetzt anrufen',
      cancel: 'Später',
    },
    email: {
      title: 'Schreiben Sie uns',
      message: 'Wir antworten in der Regel innerhalb weniger Stunden.',
      detail: 'Ihre E-Mail-App wird mit unserer Adresse info@frisco.sk geöffnet.',
      confirm: 'E-Mail schreiben',
      cancel: 'Später',
    },
  },
};

export const ConfirmActionDialog = ({ isOpen, onClose, actionType }: ConfirmActionDialogProps) => {
  const { language } = useLanguage();
  const copy = DIALOG_COPY[language]?.[actionType] ?? DIALOG_COPY.en[actionType];

  const handleConfirm = useCallback(() => {
    onClose();
    setTimeout(() => {
      if (actionType === 'call') {
        window.location.href = 'tel:+421905447220';
      } else {
        window.location.href = 'mailto:info@frisco.sk';
      }
    }, 150);
  }, [actionType, onClose]);

  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  const IconComponent = actionType === 'call' ? Phone : Mail;
  const confirmBg = actionType === 'call'
    ? 'bg-accent-red hover:bg-accent-red/90 shadow-accent-red/20'
    : 'bg-navy hover:bg-navy/90 shadow-navy/20';

  return (
    <div
      className={`fixed inset-0 z-[300] flex items-end sm:items-center justify-center px-4 sm:px-6 pb-6 sm:pb-0 transition-all duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] ${
        isOpen
          ? 'opacity-100 visible'
          : 'opacity-0 invisible pointer-events-none'
      }`}
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label={copy.title}
    >
      {/* Backdrop with blur */}
      <div
        className={`absolute inset-0 bg-black/50 backdrop-blur-md transition-opacity duration-300 ${
          isOpen ? 'opacity-100' : 'opacity-0'
        }`}
      />

      {/* Dialog card */}
      <div
        className={`relative bg-white rounded-3xl shadow-2xl max-w-sm w-full p-7 transition-all duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] ${
          isOpen
            ? 'scale-100 translate-y-0 opacity-100'
            : 'scale-95 translate-y-8 opacity-0'
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-9 h-9 rounded-full bg-charcoal/5 flex items-center justify-center text-charcoal/40 hover:text-charcoal hover:bg-charcoal/10 transition-colors active:scale-95"
          aria-label="Close"
        >
          <X size={18} />
        </button>

        {/* Icon */}
        <div className={`w-16 h-16 ${actionType === 'call' ? 'bg-accent-red' : 'bg-navy'} rounded-2xl flex items-center justify-center mb-6 shadow-lg ${actionType === 'call' ? 'shadow-accent-red/20' : 'shadow-navy/20'}`}>
          <IconComponent className="w-7 h-7 text-white" strokeWidth={1.8} />
        </div>

        {/* Title */}
        <h3 className="text-2xl font-sans font-bold text-navy mb-2 tracking-tight">
          {copy.title}
        </h3>

        {/* Message */}
        <p className="text-charcoal/70 text-[15px] leading-relaxed mb-2">
          {copy.message}
        </p>
        <p className="text-charcoal/40 text-xs leading-relaxed mb-7">
          {copy.detail}
        </p>

        {/* Buttons */}
        <div className="flex flex-col gap-2.5">
          <button
            onClick={handleConfirm}
            className={`w-full py-3.5 px-5 rounded-xl ${confirmBg} text-white font-sans font-bold text-[15px] shadow-lg transition-all hover:shadow-xl active:scale-[0.98] flex items-center justify-center gap-2.5`}
          >
            <IconComponent size={18} />
            {copy.confirm}
          </button>
          <button
            onClick={onClose}
            className="w-full py-3 px-4 rounded-xl text-charcoal/50 font-sans font-medium text-sm hover:text-charcoal/70 hover:bg-charcoal/5 transition-colors"
          >
            {copy.cancel}
          </button>
        </div>
      </div>
    </div>
  );
};
