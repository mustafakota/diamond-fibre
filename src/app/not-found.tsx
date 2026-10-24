import Link from 'next/link';
import { Home, Compass } from 'lucide-react';

export default function RootNotFound() {
  return (
    <div className="min-h-screen bg-[var(--color-warm-ivory-200)] flex items-center justify-center p-6">
      <div className="max-w-lg w-full bg-[var(--color-warm-ivory-100)] border border-[var(--color-sand-300)] rounded-3xl p-8 sm:p-10 shadow-lg text-center flex flex-col items-center gap-6">
        <span className="font-mono text-xs font-bold text-[var(--color-terracotta-600)] tracking-widest uppercase">
          404: Page Not Found / पृष्ठ नहीं मिला
        </span>

        <h1 className="font-display font-semibold text-2xl sm:text-3xl text-[var(--color-carbon-900)]">
          Diamond Fibre
        </h1>

        <div className="flex flex-col gap-2 text-xs sm:text-sm text-[var(--color-carbon-600)] leading-relaxed">
          <p>
            The requested page does not exist. Please choose your preferred language to continue.
          </p>
          <p>अनुरोधित पृष्ठ उपलब्ध नहीं है। आगे बढ़ने के लिए कृपया अपनी पसंदीदा भाषा चुनें।</p>
        </div>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-3 w-full pt-2">
          <Link
            href="/en"
            className="inline-flex items-center justify-center gap-2 bg-[var(--color-terracotta-500)] text-white hover:bg-[var(--color-terracotta-600)] px-6 py-3 rounded-full font-semibold text-xs transition-colors min-h-[44px]"
          >
            <Home className="w-4 h-4" />
            <span>Continue in English</span>
          </Link>

          <Link
            href="/hi"
            className="inline-flex items-center justify-center gap-2 border border-[var(--color-sand-400)] text-[var(--color-carbon-900)] hover:bg-[var(--color-sand-300)]/40 px-6 py-3 rounded-full font-semibold text-xs transition-colors min-h-[44px]"
          >
            <Compass className="w-4 h-4 text-[var(--color-terracotta-600)]" />
            <span>हिन्दी में जारी रखें</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
