import React from 'react';
import { Info } from 'lucide-react';
import { Locale } from '@/lib/seo';
import { getDictionary } from '@/content/dictionaries';

export interface SeasonalNoticeProps {
  locale: Locale;
  className?: string;
}

export const SeasonalNotice: React.FC<SeasonalNoticeProps> = ({ locale, className = '' }) => {
  const dict = getDictionary(locale);

  return (
    <div
      role="note"
      aria-label="Seasonal design disclaimer"
      className={`flex items-start gap-3 p-4 rounded-xl bg-[var(--color-sand-300)]/40 border border-[var(--color-sand-400)]/60 text-xs text-[var(--color-carbon-800)] leading-relaxed ${className}`}
    >
      <Info className="w-5 h-5 text-[var(--color-terracotta-500)] shrink-0 mt-0.5" />
      <div>
        <p className="font-semibold text-[var(--color-carbon-900)] mb-0.5">
          {locale === 'hi' ? 'सीजनल डिजाइन सूचना' : 'Seasonal Designs Notice'}
        </p>
        <p className="text-[var(--color-carbon-600)]">{dict.categories.seasonalNotice}</p>
      </div>
    </div>
  );
};
