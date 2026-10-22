'use client';

import React from 'react';
import { MessageCircle } from 'lucide-react';
import { buildWhatsAppLink } from '@/lib/whatsapp';
import { Locale } from '@/lib/seo';

export interface StickyWhatsAppProps {
  locale: Locale;
}

export const StickyWhatsApp: React.FC<StickyWhatsAppProps> = ({ locale }) => {
  const prefill =
    locale === 'hi'
      ? 'नमस्ते डायमंड फाइबर, मैं बेडिंग उत्पादों (गद्दे, तकिए, रज़ाइयां, कंबल) के बारे में जानकारी चाहता हूँ।'
      : 'Hello Diamond Fibre, I would like to enquire about your bedding products (Mattresses, Pillows, Razais, Blankets).';

  return (
    <aside
      aria-label="Quick WhatsApp contact"
      className="fixed bottom-5 right-5 z-40 flex items-center"
    >
      <a
        href={buildWhatsAppLink(prefill)}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Chat directly on WhatsApp with Diamond Fibre sales desk"
        className="group flex items-center gap-2 bg-[#25D366] text-white p-3.5 sm:px-4 sm:py-3 rounded-full shadow-[var(--shadow-floating)] hover:bg-[#1EBE5D] focus:outline-none focus-visible:ring-4 focus-visible:ring-[#25D366]/40 transition-all duration-200 active:scale-95 min-h-[48px] min-w-[48px]"
      >
        <MessageCircle className="w-6 h-6 shrink-0" />
        <span className="hidden sm:inline-block text-xs font-bold tracking-wide">
          {locale === 'hi' ? 'व्हाट्सएप पूछताछ' : 'WhatsApp Enquiry'}
        </span>
      </a>
    </aside>
  );
};
