import React from 'react';
import { ConfirmedDimension, LocalizedString } from '@/types/catalog';
import { Locale } from '@/lib/seo';

export interface SpecTableProps {
  dimensions: ConfirmedDimension[];
  availabilityNote?: LocalizedString;
  locale: Locale;
}

export const SpecTable: React.FC<SpecTableProps> = ({
  dimensions,
  availabilityNote,
  locale,
}) => {
  if (!dimensions || dimensions.length === 0) {
    return (
      <div className="bg-[var(--color-sand-300)]/30 border border-[var(--color-sand-400)]/60 rounded-xl p-4 text-xs text-[var(--color-carbon-600)]">
        <p>
          {availabilityNote
            ? availabilityNote[locale]
            : locale === 'hi'
            ? 'विशिष्ट माप, कवर और विकल्प वर्तमान उत्पादन बैच के अनुसार पूछताछ पर उपलब्ध हैं।'
            : 'Dimensions, fabric covers, and options are confirmed based on current production runs upon enquiry.'}
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3">
      <div className="overflow-x-auto border border-[var(--color-sand-300)] rounded-xl bg-white [webkit-overflow-scrolling:touch]">
        <table className="w-full min-w-[460px] text-left text-xs sm:text-sm">
          <thead className="bg-[var(--color-sand-300)]/40 text-[var(--color-carbon-800)] font-semibold border-b border-[var(--color-sand-300)]">
            <tr>
              <th className="py-3 px-4">
                {locale === 'hi' ? 'बेड साइज' : 'Bed Size Standard'}
              </th>
              <th className="py-3 px-4">
                {locale === 'hi' ? 'सत्यापित माप' : 'Confirmed Dimensions'}
              </th>
              <th className="py-3 px-4">
                {locale === 'hi' ? 'उपलब्धता शर्त' : 'Availability Note'}
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[var(--color-sand-300)]/60 text-[var(--color-carbon-800)]">
            {dimensions.map((dim, index) => (
              <tr key={index} className="hover:bg-[var(--color-warm-ivory-100)]/50">
                <td className="py-3 px-4 font-medium">{dim.name[locale]}</td>
                <td className="py-3 px-4 font-mono font-semibold text-[var(--color-terracotta-600)]">
                  {dim.dimensionsFeet}
                </td>
                <td className="py-3 px-4 text-xs text-[var(--color-carbon-600)]">
                  {dim.availabilityNote
                    ? dim.availabilityNote[locale]
                    : locale === 'hi'
                    ? 'मॉडल उपलब्धता के अधीन'
                    : 'Subject to model availability'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <p className="text-[11px] text-[var(--color-carbon-500)] italic px-1 block sm:hidden">
        {locale === 'hi' ? '← पूरी तालिका देखने के लिए दायें-बायें स्क्रॉल करें →' : '← Scroll horizontally to view full specifications →'}
      </p>

      {availabilityNote && (
        <p className="text-xs text-[var(--color-carbon-600)] italic px-1">
          {availabilityNote[locale]}
        </p>
      )}
    </div>
  );
};
