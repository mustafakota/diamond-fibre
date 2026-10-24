'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import Image from 'next/image';
import { Locale } from '@/lib/seo';

export interface FabricBrandIntroProps {
  locale: Locale;
}

const INTRO_STORAGE_KEY = 'diamond_fibre_intro_seen';

export const FabricBrandIntro: React.FC<FabricBrandIntroProps> = ({ locale }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isExiting, setIsExiting] = useState(false);

  const exitTimerRef = useRef<NodeJS.Timeout | null>(null);
  const cleanupTimerRef = useRef<NodeJS.Timeout | null>(null);

  const dismiss = useCallback(() => {
    try {
      sessionStorage.setItem(INTRO_STORAGE_KEY, 'true');
    } catch {
      // Storage restricted or unavailable
    }
    setIsExiting(true);
    if (cleanupTimerRef.current) clearTimeout(cleanupTimerRef.current);
    cleanupTimerRef.current = setTimeout(() => {
      setIsVisible(false);
      setIsExiting(false);
      document.body.style.overflow = '';
    }, 450);
  }, []);

  const triggerIntro = useCallback((isManualPreview = false) => {
    if (exitTimerRef.current) clearTimeout(exitTimerRef.current);
    if (cleanupTimerRef.current) clearTimeout(cleanupTimerRef.current);

    setIsExiting(false);
    setIsVisible(true);
    document.body.style.overflow = 'hidden';

    // Sequence timing: 850ms start upward curtain slide, 1350ms finish and unmount
    exitTimerRef.current = setTimeout(() => {
      setIsExiting(true);
      // Mark seen only when exit transition begins (meaning intro actually ran!)
      if (!isManualPreview) {
        try {
          sessionStorage.setItem(INTRO_STORAGE_KEY, 'true');
        } catch {}
      }
    }, 850);

    cleanupTimerRef.current = setTimeout(() => {
      setIsVisible(false);
      setIsExiting(false);
      document.body.style.overflow = '';
    }, 1350);
  }, []);

  useEffect(() => {
    // 1. Check for manual dev preview via URL query (?intro=1, ?intro=true, ?preview-intro)
    let isPreview = false;
    try {
      const params = new URLSearchParams(window.location.search);
      isPreview =
        params.get('intro') === '1' ||
        params.get('intro') === 'true' ||
        params.has('preview-intro') ||
        params.get('preview') === 'intro';
    } catch {}

    // 2. Expose development preview method on window
    if (typeof window !== 'undefined') {
      (window as unknown as { __replayDiamondIntro?: () => void }).__replayDiamondIntro = () => {
        triggerIntro(true);
      };
    }

    if (isPreview) {
      const timer = setTimeout(() => triggerIntro(true), 20);
      return () => {
        clearTimeout(timer);
        if (exitTimerRef.current) clearTimeout(exitTimerRef.current);
        if (cleanupTimerRef.current) clearTimeout(cleanupTimerRef.current);
        document.body.style.overflow = '';
      };
    }

    // 3. Reduced motion check: skip for regular visits if user prefers reduced motion
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      try {
        sessionStorage.setItem(INTRO_STORAGE_KEY, 'true');
      } catch {}
      return;
    }

    // 4. Session check: only play once per browser session
    try {
      const seen = sessionStorage.getItem(INTRO_STORAGE_KEY);
      if (seen === 'true') {
        return;
      }
    } catch {
      // Storage restricted or unavailable: proceed safely
    }

    // 5. Trigger intro on mount (DO NOT write to sessionStorage here to prevent StrictMode race conditions)
    const timer = setTimeout(() => {
      triggerIntro(false);
    }, 20);

    // 6. Keyboard listener for quick dismissal (Escape / Space) and dev replay (Ctrl+Shift+I)
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' || e.key === ' ') {
        dismiss();
      }
      if (e.ctrlKey && e.shiftKey && (e.key === 'I' || e.key === 'i')) {
        triggerIntro(true);
      }
    };
    window.addEventListener('keydown', handleKeyDown);

    // 7. Failsafe: max 3s timeout to guarantee overlay cannot block page under any circumstance
    const failsafe = setTimeout(() => {
      document.body.style.overflow = '';
    }, 3000);

    return () => {
      clearTimeout(timer);
      clearTimeout(failsafe);
      if (exitTimerRef.current) clearTimeout(exitTimerRef.current);
      if (cleanupTimerRef.current) clearTimeout(cleanupTimerRef.current);
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [dismiss, triggerIntro]);

  if (!isVisible) return null;

  return (
    <div
      id="diamond-fabric-brand-intro"
      aria-hidden="true"
      role="presentation"
      onClick={dismiss}
      className={`fixed inset-0 z-[9999] flex flex-col items-center justify-center cursor-pointer select-none transition-all duration-500 ease-[cubic-bezier(0.77,0,0.175,1)] ${
        isExiting
          ? '-translate-y-full opacity-0 pointer-events-none'
          : 'translate-y-0 opacity-100 pointer-events-auto'
      }`}
      style={{
        backgroundColor: '#F3EFE7',
        backgroundImage: `
          radial-gradient(ellipse at 50% 50%, rgba(250, 248, 244, 0.85) 0%, rgba(243, 239, 231, 0.95) 70%, rgba(229, 220, 206, 0.98) 100%),
          repeating-linear-gradient(45deg, rgba(217, 204, 182, 0.25) 0px, rgba(217, 204, 182, 0.25) 1px, transparent 1px, transparent 4px),
          repeating-linear-gradient(-45deg, rgba(217, 204, 182, 0.25) 0px, rgba(217, 204, 182, 0.25) 1px, transparent 1px, transparent 4px)
        `,
      }}
    >
      {/* Subtle bedding textile thread highlight */}
      <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/20 to-transparent pointer-events-none opacity-60" />

      {/* Discrete Skip Button */}
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          dismiss();
        }}
        className="absolute top-4 right-4 sm:top-8 sm:right-8 z-10 min-h-[44px] min-w-[44px] inline-flex items-center justify-center px-4 py-2 rounded-full border border-[var(--color-sand-400)]/80 bg-white/70 backdrop-blur-xs text-xs font-mono uppercase tracking-widest text-[var(--color-carbon-700)] hover:text-[var(--color-carbon-900)] hover:bg-white/90 active:scale-[1.02] press-scale duration-150 ease-out motion-reduce:transform-none transition-all cursor-pointer"
      >
        {locale === 'hi' ? 'छोड़ें ✕' : 'Skip ✕'}
      </button>

      {/* Center Brand Emblem Reveal */}
      <div className="relative z-10 flex flex-col items-center gap-4 px-6 text-center animate-fabric-reveal">
        {/* Isolated Monogram Emblem */}
        <div className="relative w-20 h-20 sm:w-24 sm:h-24 drop-shadow-sm">
          <Image
            src="/images/logo/diamond-fibre-symbol.png"
            alt=""
            width={96}
            height={96}
            priority
            className="w-full h-full object-contain"
          />
        </div>

        {/* Terracotta Brand Accent Rule */}
        <div className="w-10 h-[1.5px] bg-[var(--color-terracotta-500)] rounded-full animate-fabric-accent" />

        {/* Brand Typographic Identity */}
        <div className="flex flex-col items-center gap-1">
          <h2 className="font-display font-semibold text-lg sm:text-xl tracking-[0.16em] text-[var(--color-carbon-900)] uppercase">
            Diamond Fibre
          </h2>
          <p className="text-[11px] sm:text-xs font-mono uppercase tracking-widest text-[var(--color-carbon-600)]">
            {locale === 'hi' ? 'रतलाम, मध्य प्रदेश • बेडिंग निर्माण' : 'Ratlam, Madhya Pradesh • Bedding Manufacturer'}
          </p>
        </div>
      </div>
    </div>
  );
};
