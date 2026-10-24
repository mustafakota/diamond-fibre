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
      className="fixed bottom-[max(1.25rem,env(safe-area-inset-bottom))] right-[max(1.25rem,env(safe-area-inset-right))] z-40 flex items-center"
    >
      <a
        href={buildWhatsAppLink(prefill)}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={
          locale === 'hi'
            ? 'डायमंड फाइबर सेल्स डेस्क से व्हाट्सएप पर चैट करें'
            : 'Chat directly on WhatsApp with Diamond Fibre sales desk'
        }
        className="group flex items-center gap-2.5 bg-[var(--color-carbon-900)] text-white hover:bg-[var(--color-carbon-800)] border border-[var(--color-carbon-700)] p-3 sm:px-4 sm:py-3 rounded-full shadow-[var(--shadow-floating)] focus:outline-none focus-visible:ring-4 focus-visible:ring-[var(--color-terracotta-500)]/40 transition-all duration-150 active:scale-[1.02] press-scale ease-out motion-reduce:transform-none min-h-[48px] min-w-[48px]"
      >
        <span className="relative flex items-center justify-center shrink-0">
          <MessageCircle className="w-5 h-5 text-[#25D366] shrink-0" />
          <span
            className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-[#25D366]"
            aria-hidden="true"
          />
        </span>
        <span className="hidden sm:inline-block text-xs font-semibold tracking-wide text-[var(--color-warm-ivory-100)]">
          {locale === 'hi' ? 'व्हाट्सएप पूछताछ' : 'WhatsApp Enquiry'}
        </span>
      </a>
    </aside>
  );
};
