'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ArrowLeft, Home } from 'lucide-react';

export default function NotFound() {
  const pathname = usePathname() || '';
  const isHindi = pathname.startsWith('/hi');

  return (
    <div className="py-20 px-4 max-w-2xl mx-auto text-center flex flex-col items-center gap-6">
      <span className="font-mono text-sm font-bold text-[var(--color-terracotta-600)] tracking-widest uppercase">
        404 — {isHindi ? 'पृष्ठ नहीं मिला' : 'Page Not Found'}
      </span>
      <h1 className="font-display font-bold text-3xl sm:text-4xl text-[var(--color-carbon-900)]">
        {isHindi ? 'अनुरोधित पृष्ठ उपलब्ध नहीं है।' : 'The requested page does not exist.'}
      </h1>
      <p className="text-sm text-[var(--color-carbon-600)] max-w-md leading-relaxed">
        {isHindi
          ? 'यह पृष्ठ हटा दिया गया है या अनुपलब्ध है। आप हमारे होमपेज पर लौट सकते हैं या हमारी पांच बेडिंग श्रेणियां देख सकते हैं।'
          : 'The page you are looking for may have been moved or is unavailable. You can return to our homepage or browse our five bedding product categories.'}
      </p>

      <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
        <Link
          href={isHindi ? '/hi' : '/en'}
          className="inline-flex items-center gap-2 bg-[var(--color-terracotta-500)] text-white hover:bg-[var(--color-terracotta-600)] px-6 py-2.5 rounded-full font-semibold text-xs transition-colors min-h-[44px]"
        >
          <Home className="w-4 h-4" />
          <span>{isHindi ? 'होमपेज पर लौटें' : 'Return Home'}</span>
        </Link>
        <Link
          href={isHindi ? '/hi/products' : '/en/products'}
          className="inline-flex items-center gap-2 border border-[var(--color-sand-400)] text-[var(--color-carbon-900)] hover:bg-[var(--color-sand-300)]/40 px-6 py-2.5 rounded-full font-semibold text-xs transition-colors min-h-[44px]"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>{isHindi ? 'उत्पाद श्रेणियां' : 'Browse Categories'}</span>
        </Link>
      </div>
    </div>
  );
}
