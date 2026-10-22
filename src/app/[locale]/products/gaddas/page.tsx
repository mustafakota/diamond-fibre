import { redirect, RedirectType } from 'next/navigation';

/**
 * Legacy category route redirect.
 * Gaddas and Mattresses are unified under the canonical /products/mattresses route.
 * "Gadda" is the Hindi term and "mattress" is the English term for the same product category.
 */
export default async function GaddasRedirectPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: rawLocale } = await params;
  const locale = rawLocale === 'hi' ? 'hi' : 'en';
  redirect(`/${locale}/products/mattresses`, RedirectType.replace);
}
