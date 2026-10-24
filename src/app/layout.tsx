import type { Metadata } from 'next';
import { manrope, inter, notoSansDevanagari } from '@/lib/fonts';
import { getBaseUrl } from '@/lib/seo';
import GoogleAnalytics from '@/components/analytics/GoogleAnalytics';
import MicrosoftClarity from '@/components/analytics/MicrosoftClarity';
import './globals.css';

export const metadata: Metadata = {
  metadataBase: new URL(getBaseUrl()),
  title: 'Diamond Fibre | Bedding Manufacturer in Ratlam',
  description:
    'Bedding manufacturer in Ratlam, Madhya Pradesh. Direct manufacturing of mattresses (gaddas), pillows, razais, and blankets.',
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: 'any' },
      { url: '/favicon.png', sizes: '32x32', type: 'image/png' },
      { url: '/icon.png', sizes: '192x192', type: 'image/png' },
      { url: '/icon-512.png', sizes: '512x512', type: 'image/png' },
    ],
    apple: [{ url: '/apple-icon.png', sizes: '180x180', type: 'image/png' }],
  },
  verification: {
    google: '__dXrdI16pfeAmjzqS4nNuocrCO3JJ58Jtx9Iyiha24',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${manrope.variable} ${inter.variable} ${notoSansDevanagari.variable}`}
    >
      <body className="antialiased min-h-screen bg-[var(--color-warm-ivory-200)] text-[var(--color-carbon-900)]">
        <GoogleAnalytics />
        <MicrosoftClarity />
        {children}
      </body>
    </html>
  );
}
