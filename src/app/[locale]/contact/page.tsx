import React from 'react';
import Link from 'next/link';
import { Locale, buildLocalizedMetadata } from '@/lib/seo';
import { getDictionary } from '@/content/dictionaries';
import { Badge } from '@/components/ui/Badge';
import { Card } from '@/components/ui/Card';
import { FadeIn } from '@/components/motion/FadeIn';
import { PROVISIONAL_DISPLAY_PHONE, buildPhoneLink, buildWhatsAppLink } from '@/lib/whatsapp';
import { MessageCircle, Phone, MapPin, Truck, ArrowRight, Navigation, ExternalLink } from 'lucide-react';

const GOOGLE_MAPS_EMBED_URL =
  'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3663.8816944777363!2d75.0305643389348!3d23.320050819537755!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3963fdc5570f95b5%3A0x81491f7916d29535!2sDiamond%20Fibres!5e0!3m2!1sen!2sin!4v1792588046330!5m2!1sen!2sin';

const GOOGLE_MAPS_DIRECTIONS_URL =
  'https://www.google.com/maps/dir/?api=1&destination=Diamond+Fibres,+Ratlam';

const GOOGLE_MAPS_LISTING_URL =
  'https://maps.google.com/?cid=9316049051871516981';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: rawLocale } = await params;
  const locale: Locale = rawLocale === 'hi' ? 'hi' : 'en';

  return buildLocalizedMetadata({
    locale,
    pathSegment: 'contact',
    title:
      locale === 'hi'
        ? 'संपर्क करें व स्थान | डायमंड फाइबर रतलाम'
        : 'Contact Us & Location | Diamond Fibre Ratlam',
    description:
      locale === 'hi'
        ? 'डायमंड फाइबर से संपर्क करें। रतलाम (मध्य प्रदेश) स्थित विनिर्माण इकाई की गूगल मैप्स स्थिति, फोन व व्हाट्सएप पूछताछ।'
        : 'Contact Diamond Fibre in Ratlam, Madhya Pradesh. Official Google Maps listing, direct phone, WhatsApp, and wholesale enquiry channels.',
  });
}

export default async function ContactPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: rawLocale } = await params;
  const locale: Locale = rawLocale === 'hi' ? 'hi' : 'en';
  const dict = getDictionary(locale);

  return (
    <div className="py-10 md:py-16 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto w-full flex flex-col gap-10">
      {/* 1. Header */}
      <FadeIn direction="up">
        <div className="flex flex-col gap-3">
          <Badge variant="accent" className="self-start">
            {locale === 'hi' ? 'सीधा संपर्क' : 'Direct Channels'}
          </Badge>
          <h1 className="font-display font-bold text-3xl sm:text-4xl text-[var(--color-carbon-900)]">
            {dict.contact.title}
          </h1>
          <p className="text-sm sm:text-base text-[var(--color-carbon-600)] leading-relaxed">
            {dict.contact.subtitle}
          </p>
        </div>
      </FadeIn>

      {/* 2. Primary Contact Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* WhatsApp & Call */}
        <FadeIn direction="right" delay={0.1}>
          <Card className="flex flex-col justify-between gap-6 p-6 h-full">
            <div className="flex flex-col gap-3">
              <div className="w-10 h-10 rounded-full bg-[#25D366]/15 text-[#1EBE5D] flex items-center justify-center">
                <MessageCircle className="w-5 h-5" />
              </div>
              <h2 className="font-display font-bold text-xl text-[var(--color-carbon-900)]">
                {locale === 'hi' ? 'व्हाट्सएप व फोन कॉल' : 'WhatsApp & Phone'}
              </h2>
              <p className="text-xs text-[var(--color-carbon-600)] leading-relaxed">
                {locale === 'hi'
                  ? 'उत्पादों के विकल्पों, उपलब्धता और कीमतों की जानकारी के लिए हमारी टीम से संपर्क करें।'
                  : 'Connect directly with our team to inquire about product options, dimensions, and current pricing.'}
              </p>
              <span className="text-xs font-mono font-semibold text-[var(--color-carbon-900)] pt-1">
                {PROVISIONAL_DISPLAY_PHONE}{' '}
                <span className="text-[10px] text-[var(--color-terracotta-600)] font-sans">
                  ({locale === 'hi' ? 'अस्थायी - पुष्टि प्रतीक्षित' : 'Provisional'})
                </span>
              </span>
            </div>

            <div className="flex flex-col sm:flex-row gap-2 pt-2">
              <a
                href={buildWhatsAppLink(
                  locale === 'hi'
                    ? 'नमस्ते डायमंड फाइबर, मैं बेडिंग उत्पादों के बारे में पूछताछ करना चाहता हूँ।'
                    : 'Hello Diamond Fibre, I would like to enquire about your bedding products.'
                )}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 bg-[#25D366] text-white hover:bg-[#1EBE5D] px-5 py-2.5 rounded-full font-semibold text-xs transition-colors min-h-[44px]"
              >
                <MessageCircle className="w-4 h-4" />
                <span>WhatsApp</span>
              </a>

              <a
                href={buildPhoneLink()}
                className="inline-flex items-center justify-center gap-2 border border-[var(--color-sand-400)] text-[var(--color-carbon-900)] hover:bg-[var(--color-sand-300)]/40 px-5 py-2.5 rounded-full font-semibold text-xs transition-colors min-h-[44px]"
              >
                <Phone className="w-4 h-4 text-[var(--color-carbon-600)]" />
                <span>{locale === 'hi' ? 'कॉल करें' : 'Voice Call'}</span>
              </a>
            </div>
          </Card>
        </FadeIn>

        {/* Manufacturing Location */}
        <FadeIn direction="left" delay={0.15}>
          <Card className="flex flex-col justify-between gap-6 p-6 h-full">
            <div className="flex flex-col gap-3">
              <div className="w-10 h-10 rounded-full bg-[var(--color-terracotta-50)] text-[var(--color-terracotta-600)] flex items-center justify-center">
                <MapPin className="w-5 h-5" />
              </div>
              <h2 className="font-display font-bold text-xl text-[var(--color-carbon-900)]">
                {dict.contact.locationLabel}
              </h2>
              <p className="text-xs text-[var(--color-carbon-600)] leading-relaxed">
                {locale === 'hi'
                  ? 'हमारी विनिर्माण इकाई रतलाम, मध्य प्रदेश में स्थित है।'
                  : 'Our dedicated manufacturing unit operates from Ratlam, Madhya Pradesh, India.'}
              </p>
              <div className="flex items-center justify-between pt-1 flex-wrap gap-2">
                <span className="font-semibold text-sm text-[var(--color-carbon-900)]">
                  {dict.contact.locationValue}
                </span>
                <a
                  href={GOOGLE_MAPS_LISTING_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-xs font-semibold text-[var(--color-terracotta-600)] hover:underline"
                >
                  <span>{locale === 'hi' ? 'गूगल मैप्स पर देखें' : 'View Listing'}</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>

            <div className="pt-2 border-t border-[var(--color-sand-300)]">
              <p className="text-[11px] text-[var(--color-carbon-600)]">
                {locale === 'hi'
                  ? '*सार्वजनिक सड़क का पता मालिक के अनुमोदन के अधीन है।'
                  : '*Specific facility address details are subject to owner approval.'}
              </p>
            </div>
          </Card>
        </FadeIn>
      </div>

      {/* 3. Official Google Maps Interactive Section */}
      <FadeIn direction="up" delay={0.2}>
        <section className="flex flex-col gap-4">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div>
              <span className="text-xs font-mono uppercase tracking-widest text-[var(--color-terracotta-600)] font-semibold">
                {locale === 'hi' ? 'मानचित्र व स्थिति' : 'Map & Coordinates'}
              </span>
              <h2 className="font-display font-bold text-2xl text-[var(--color-carbon-900)] mt-1">
                {locale === 'hi' ? 'हमारी रतलाम विनिर्माण इकाई' : 'Locate Our Ratlam Facility'}
              </h2>
              <p className="text-xs sm:text-sm text-[var(--color-carbon-600)] mt-1 leading-relaxed">
                {locale === 'hi'
                  ? 'गूगल मैप्स पर डायमंड फाइबर्स की आधिकारिक लिस्टिंग (रतलाम, मध्य प्रदेश)।'
                  : 'Official Google Maps business listing for Diamond Fibres in Ratlam, Madhya Pradesh.'}
              </p>
            </div>

            <div className="shrink-0 flex items-center gap-2">
              <a
                href={GOOGLE_MAPS_DIRECTIONS_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 bg-[var(--color-carbon-900)] hover:bg-[var(--color-carbon-800)] text-white px-5 py-2.5 rounded-full font-semibold text-xs transition-colors min-h-[44px] shadow-xs"
              >
                <Navigation className="w-4 h-4 text-[var(--color-terracotta-400)]" />
                <span>{locale === 'hi' ? 'दिशा-निर्देश प्राप्त करें' : 'Get Directions'}</span>
              </a>

              <a
                href={GOOGLE_MAPS_LISTING_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-1.5 border border-[var(--color-sand-400)] text-[var(--color-carbon-900)] hover:bg-[var(--color-sand-300)]/40 px-4 py-2.5 rounded-full font-semibold text-xs transition-colors min-h-[44px]"
                aria-label={locale === 'hi' ? 'गूगल मैप्स पर नई विंडो में खोलें' : 'Open in Google Maps in new window'}
              >
                <ExternalLink className="w-4 h-4 text-[var(--color-carbon-600)]" />
                <span className="hidden sm:inline">{locale === 'hi' ? 'मैप्स पर खोलें' : 'Open Maps'}</span>
              </a>
            </div>
          </div>

          {/* Responsive Map Embed Container */}
          <div className="w-full h-[320px] sm:h-[380px] lg:h-[450px] rounded-2xl sm:rounded-3xl overflow-hidden border border-[var(--color-sand-300)] shadow-xs bg-[var(--color-sand-200)] relative">
            <iframe
              src={GOOGLE_MAPS_EMBED_URL}
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen={false}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title={
                locale === 'hi'
                  ? 'गूगल मैप्स पर डायमंड फाइबर्स रतलाम'
                  : 'Diamond Fibres Ratlam Google Maps Business Listing'
              }
              className="w-full h-full border-0 block"
            />
          </div>

          <p className="text-[11px] text-[var(--color-carbon-500)] italic px-1">
            {locale === 'hi'
              ? '*फैक्टरी विजिट और व्यक्तिगत व्यापारिक बैठकों के लिए कृपया पूर्व समय निर्धारित करें। सार्वजनिक सड़क का पता अनुमोदन के अधीन है।'
              : '*Facility visits and commercial meetings require prior appointment. Specific road address details are subject to owner approval.'}
          </p>
        </section>
      </FadeIn>

      {/* 4. Mandatory Conditional Serviceability Disclosure */}
      <FadeIn direction="up" delay={0.25}>
        <div className="p-6 rounded-2xl bg-[var(--color-sand-300)]/30 border border-[var(--color-sand-400)]/60 flex items-start gap-3.5">
          <Truck className="w-5 h-5 text-[var(--color-terracotta-500)] shrink-0 mt-0.5" />
          <div className="flex flex-col gap-1">
            <span className="text-xs font-bold uppercase tracking-wider text-[var(--color-carbon-900)]">
              {locale === 'hi' ? 'डिलीवरी व माल आपूर्ति सूचना' : 'Delivery & Serviceability Policy'}
            </span>
            <p className="text-xs sm:text-sm text-[var(--color-carbon-800)] leading-relaxed">
              {dict.contact.serviceabilityNotice}
            </p>
          </div>
        </div>
      </FadeIn>

      {/* 5. Wholesale Callout */}
      <FadeIn direction="up" delay={0.3}>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-2xl bg-[var(--color-warm-ivory-100)] border border-[var(--color-sand-300)]">
          <div>
            <span className="text-xs font-semibold uppercase tracking-wider text-[var(--color-carbon-600)] block mb-0.5">
              {locale === 'hi' ? 'थोक व्यापारी या दुकानदार?' : 'Retailer or Wholesaler?'}
            </span>
            <p className="text-sm font-semibold text-[var(--color-carbon-900)]">
              {locale === 'hi'
                ? 'थोक आपूर्ति पूछताछ फॉर्म भरें'
                : 'Submit structured requirements through our B2B form'}
            </p>
          </div>
          <Link
            href={`/${locale}/wholesale`}
            className="inline-flex items-center justify-center gap-1.5 bg-[var(--color-terracotta-500)] text-white hover:bg-[var(--color-terracotta-600)] px-6 py-2.5 rounded-full font-semibold text-xs transition-colors min-h-[44px] shrink-0"
          >
            <span>{locale === 'hi' ? 'थोक फॉर्म' : 'Wholesale Form'}</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </FadeIn>
    </div>
  );
}
