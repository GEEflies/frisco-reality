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

const DIALOG_COPY: Record<string, Record<ActionType, { title: string; message: string; confirm: string; cancel: string }>> = {
  sk: {
    call: {
      title: 'Zavolať nám?',
      message: 'Budete presmerovaný/á na telefónny hovor na číslo 0905 447 220.',
      confirm: 'Zavolať',
      cancel: 'Zrušiť',
    },
    email: {
      title: 'Napísať nám?',
      message: 'Budete presmerovaný/á do e-mailovej aplikácie na adresu info@frisco.sk.',
      confirm: 'Napísať',
      cancel: 'Zrušiť',
    },
  },
  en: {
    call: {
      title: 'Call us?',
      message: 'You will be redirected to make a phone call to 0905 447 220.',
      confirm: 'Call',
      cancel: 'Cancel',
    },
    email: {
      title: 'Email us?',
      message: 'You will be redirected to your email app to contact info@frisco.sk.',
      confirm: 'Send email',
      cancel: 'Cancel',
    },
  },
  de: {
    call: {
      title: 'Uns anrufen?',
      message: 'Sie werden weitergeleitet, um die Nummer 0905 447 220 anzurufen.',
      confirm: 'Anrufen',
      cancel: 'Abbrechen',
    },
    email: {
      title: 'Uns schreiben?',
      message: 'Sie werden zur E-Mail-App weitergeleitet, um info@frisco.sk zu kontaktieren.',
      confirm: 'E-Mail senden',
      cancel: 'Abbrechen',
    },
  },
};

export const ConfirmActionDialog = ({ isOpen, onClose, actionType }: ConfirmActionDialogProps) => {
  const { language } = useLanguage();
  const copy = DIALOG_COPY[language]?.[actionType] ?? DIALOG_COPY.en[actionType];

  const handleConfirm = useCallback(() => {
    onClose();
    // Small delay so the dialog closes smoothly before redirect
    setTimeout(() => {
      if (actionType === 'call') {
        window.location.href = 'tel:+421905447220';
      } else {
        window.location.href = 'mailto:info@frisco.sk';
      }
    }, 150);
  }, [actionType, onClose]);

  // Close on Escape key
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // Prevent body scroll when dialog is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  const IconComponent = actionType === 'call' ? Phone : Mail;
  const iconBg = actionType === 'call' ? 'bg-accent-red' : 'bg-navy';
  const confirmBg = actionType === 'call'
    ? 'bg-accent-red hover:bg-accent-red/90 shadow-accent-red/20'
    : 'bg-navy hover:bg-navy/90 shadow-navy/20';

  return (
    <div
      className={`fixed inset-0 z-[300] flex items-center justify-center px-6 transition-all duration-200 ${
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
        className={`absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity duration-200 ${
          isOpen ? 'opacity-100' : 'opacity-0'
        }`}
      />

      {/* Dialog card */}
      <div
        className={`relative bg-white rounded-2xl shadow-2xl max-w-sm w-full p-6 transition-all duration-200 ${
          isOpen
            ? 'scale-100 translate-y-0 opacity-100'
            : 'scale-95 translate-y-4 opacity-0'
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 rounded-full bg-charcoal/5 flex items-center justify-center text-charcoal/50 hover:text-charcoal hover:bg-charcoal/10 transition-colors"
          aria-label="Close"
        >
          <X size={16} />
        </button>

        {/* Icon */}
        <div className={`w-14 h-14 ${iconBg} rounded-full flex items-center justify-center mb-5 shadow-lg`}>
          <IconComponent className="w-6 h-6 text-white" strokeWidth={2} />
        </div>

        {/* Title */}
        <h3 className="text-xl font-serif font-bold text-navy mb-2">
          {copy.title}
        </h3>

        {/* Message */}
        <p className="text-charcoal/60 text-sm leading-relaxed mb-6">
          {copy.message}
        </p>

        {/* Buttons */}
        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 py-3 px-4 rounded-xl border border-charcoal/15 text-charcoal/70 font-sans font-medium text-sm hover:bg-charcoal/5 transition-colors"
          >
            {copy.cancel}
          </button>
          <button
            onClick={handleConfirm}
            className={`flex-1 py-3 px-4 rounded-xl ${confirmBg} text-white font-sans font-bold text-sm shadow-lg transition-all hover:shadow-xl active:scale-[0.98] flex items-center justify-center gap-2`}
          >
            <IconComponent size={16} />
            {copy.confirm}
          </button>
        </div>
      </div>
    </div>
  );
};
