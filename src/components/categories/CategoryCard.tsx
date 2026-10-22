import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { CategoryData } from '@/types/catalog';
import { Locale } from '@/lib/seo';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { buildWhatsAppLink } from '@/lib/whatsapp';
import { MessageCircle, ArrowRight } from 'lucide-react';

export interface CategoryCardProps {
  category: CategoryData;
  locale: Locale;
}

export const CategoryCard: React.FC<CategoryCardProps> = ({ category, locale }) => {
  const repImage = category.representativeImages?.[0];

  return (
    <Card className="flex flex-col justify-between h-full hover:border-[var(--color-sand-400)] transition-all duration-200 overflow-hidden">
      <div className="flex flex-col gap-4">
        {/* Representative Image Asset */}
        {repImage && (
          <div className="relative aspect-[16/10] w-full rounded-xl overflow-hidden border border-[var(--color-sand-300)] bg-[var(--color-sand-300)]/30">
            <Image
              src={repImage.src}
              alt={repImage.alt[locale]}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              className="object-cover"
            />
          </div>
        )}

        {/* Tag & Title */}
        <div className="flex items-start justify-between gap-2">
          <Badge variant="accent">{category.shortTag[locale]}</Badge>
          <span className="text-[11px] font-mono text-[var(--color-carbon-600)]">
            Est. 2018
          </span>
        </div>

        <div>
          <h3 className="font-display font-bold text-xl sm:text-2xl text-[var(--color-carbon-900)] mb-1">
            <Link
              href={`/${locale}/products/${category.slug}`}
              className="hover:text-[var(--color-terracotta-600)] transition-colors focus:outline-none focus-visible:underline"
            >
              {category.name[locale]}
            </Link>
          </h3>
          <p className="text-xs font-medium text-[var(--color-terracotta-600)] mb-3">
            {category.tagline[locale]}
          </p>
          <p className="text-xs sm:text-sm text-[var(--color-carbon-600)] leading-relaxed">
            {category.overview[locale]}
          </p>
        </div>

        {/* Confirmed Sizes indicator if available */}
        {category.confirmedDimensions && category.confirmedDimensions.length > 0 && (
          <div className="pt-2 border-t border-[var(--color-sand-300)]/60">
            <span className="text-[11px] font-semibold text-[var(--color-carbon-800)] block mb-1">
              {locale === 'hi' ? 'सत्यापित मानक माप:' : 'Confirmed Standard Sizes:'}
            </span>
            <div className="flex flex-wrap gap-1.5">
              {category.confirmedDimensions.map((dim, idx) => (
                <span
                  key={idx}
                  className="inline-block text-[11px] font-mono font-semibold px-2 py-0.5 rounded-md bg-[var(--color-sand-300)]/50 text-[var(--color-carbon-900)]"
                >
                  {dim.dimensionsFeet}
                </span>
              ))}
            </div>
            <span className="text-[10px] text-[var(--color-carbon-600)] mt-1 block">
              {locale === 'hi'
                ? '*विशिष्ट मॉडल की उपलब्धता के अधीन'
                : '*Subject to specific model availability'}
            </span>
          </div>
        )}
      </div>

      {/* Action Buttons */}
      <div className="pt-6 mt-4 border-t border-[var(--color-sand-300)] flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
        <Link
          href={`/${locale}/products/${category.slug}`}
          className="inline-flex items-center justify-center gap-1.5 text-xs font-semibold px-4 py-2.5 rounded-full border border-[var(--color-sand-400)] text-[var(--color-carbon-900)] hover:bg-[var(--color-sand-300)]/40 transition-colors min-h-[44px]"
        >
          <span>{locale === 'hi' ? 'विवरण देखें' : 'View Range'}</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>

        <a
          href={buildWhatsAppLink(category.whatsappPrefill[locale])}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center justify-center gap-1.5 text-xs font-bold px-4 py-2.5 rounded-full bg-[#25D366] text-white hover:bg-[#1EBE5D] transition-colors min-h-[44px] shadow-xs"
        >
          <MessageCircle className="w-3.5 h-3.5" />
          <span>{locale === 'hi' ? 'व्हाट्सएप पूछताछ' : 'Ask on WhatsApp'}</span>
        </a>
      </div>
    </Card>
  );
};
