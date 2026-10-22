import React from 'react';
import Image from 'next/image';
import { RepresentativeImage } from '@/types/catalog';
import { Locale } from '@/lib/seo';

export interface SeasonalGalleryProps {
  images: RepresentativeImage[];
  locale: Locale;
}

export const SeasonalGallery: React.FC<SeasonalGalleryProps> = ({ images, locale }) => {
  if (!images || images.length === 0) return null;

  return (
    <div className="flex flex-col gap-3">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {images.map((img, idx) => (
          <div key={idx} className="flex flex-col gap-1.5">
            <div className="relative aspect-[16/10] w-full rounded-2xl overflow-hidden border border-[var(--color-sand-300)] bg-[var(--color-sand-300)]/20 shadow-xs">
              <Image
                src={img.src}
                alt={img.alt[locale]}
                fill
                sizes="(max-width: 768px) 100vw, 500px"
                className="object-cover"
              />
            </div>
            {img.caption && (
              <p className="text-[11px] text-[var(--color-carbon-600)] italic px-1">
                * {img.caption[locale]}
              </p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
