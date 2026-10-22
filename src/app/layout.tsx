import type { Metadata } from 'next';
import { spaceGrotesk, inter, notoSansDevanagari } from '@/lib/fonts';
import './globals.css';

export const metadata: Metadata = {
  title: 'Diamond Fibre | Bedding Manufacturer in Ratlam',
  description:
    'Family-run bedding manufacturer in Ratlam, Madhya Pradesh since 2018. Producing mattresses (gaddas), pillows, razais, and blankets.',
  icons: {
    icon: [
      { url: '/favicon.png', sizes: '32x32', type: 'image/png' },
      { url: '/icon.png', sizes: '192x192', type: 'image/png' },
    ],
    apple: [{ url: '/icon.png', sizes: '192x192', type: 'image/png' }],
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
      className={`${spaceGrotesk.variable} ${inter.variable} ${notoSansDevanagari.variable}`}
    >
      <body className="antialiased min-h-screen bg-[var(--color-warm-ivory-200)] text-[var(--color-carbon-900)]">
        {children}
      </body>
    </html>
  );
}
